package modules.entityhub.services.impl

import java.util.Objects

import javax.inject.Inject
import modules.common.exceptions.ProjectNotFoundException
import modules.common.vocabulary.{ASN, DBO}
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.models._
import modules.entityhub.services.{EntityService, QueryFactory}
import modules.entityhub.utils.ValueUtils
import modules.project.models.RepositoryType
import modules.project.services.ProjectService
import modules.system.entities.EdgeFilterMode
import modules.system.services.SettingsService
import org.eclipse.rdf4j.model
import org.eclipse.rdf4j.model.vocabulary._
import org.eclipse.rdf4j.query.QueryLanguage
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder
import org.eclipse.rdf4j.sparqlbuilder.core.query.Queries
import org.eclipse.rdf4j.sparqlbuilder.graphpattern.GraphPatterns

import scala.collection.immutable.HashMap
import scala.collection.mutable
import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Using}

class EntityServiceImpl @Inject()(projectService: ProjectService,
                                  settingsService: SettingsService,
                                  queryFactory: QueryFactory)
                                 (implicit val ec: ExecutionContext) extends EntityService {

  val compoundNodePrefix = "_compound://"

  override def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]] = {
    projectService.findRepoById(projectId) map {
      case Some((_, repo)) =>
        val f = repo.getValueFactory
        val q =
          "SELECT " + (if (graph.isEmpty) "?g" else "") +
            " WHERE { " +
            "  GRAPH ?g { " +
            "   ?s ?p ?o " +
            "}}"

        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          val s = f.createIRI(uri)
          tq.setBinding("s", s)
          graph match {
            case Some(iri) => tq.setBinding("g", f.createIRI(iri))
            case _ =>
          }
          val results = tq.evaluate
          if (results.hasNext) {
            val bindings = results.next
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            Some(ValueUtils.createValue(projectId, Some(g), s).asInstanceOf[IRI])
          } else None
        } match {
          case Success(value) => value
          case Failure(e) => throw e
        }
      case None => throw ProjectNotFoundException(projectId)
    }
  }

  override def findTriplesFromNode(projectId: String, graph: Option[String],
                                   subj: String, pred: Option[String],
                                   nodeType: Option[String],
                                   currentUser: String,
                                   limit: Option[Int], offset: Option[Int]): Future[TriplePage] = {

    val futureProjRepo = projectService.findRepoById(projectId)
    val futureUserSettings = settingsService.findUserSettings(projectId, currentUser)
    for {
      projRepo <- futureProjRepo
      userSettings <- futureUserSettings
    } yield {
      projRepo match {
        case Some((_, repo)) =>
          val (lim, off) = calcLimitOffset(limit, offset)

          val f = repo.getValueFactory

          // here we use user settings to apply filters on nodes and edges
          val edgeRenderer = userSettings.visualGraph.edgeRenderer

          val excludePreds = edgeRenderer.excludePreds.map(s => f.createIRI(s.value))
          val includePreds = edgeRenderer.includePreds.map(s => f.createIRI(s.value))

          val excludePredsFilter = excludePreds map { p => s"FILTER (?p != <${p.stringValue()}>) " } mkString ""
          val includePredsFilter = s"FILTER (${includePreds map { p => s"?p = <${p.stringValue()}>" } mkString " OR "}) "
          val predsFilter = if (edgeRenderer.filterMode == EdgeFilterMode.Inclusive)
            includePredsFilter else excludePredsFilter

          val objFilter = nodeType match {
            case Some("iri") => "FILTER isIRI(?o) "
            case Some("literal") => "FILTER isLiteral(?o) "
            case _ => ""
          }

          val subjIri = f.createIRI(subj)
          val s = ValueUtils.createValue(projectId, graph, subjIri)

          val predCount: Map[String, Int] =
            if (pred.isEmpty && edgeRenderer.groupPreds) {
              val countPredsQuery = "SELECT ?p (COUNT (?o) as ?count) " +
                " WHERE { " +
                "   ?s ?p ?o " +
                objFilter +
                "} GROUP BY ?p"
              Using(repo.getConnection) { conn =>
                val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, countPredsQuery)
                tq.setBinding("s", subjIri)
                val results = tq.evaluate
                val predCount = mutable.HashMap[String, Int]()
                while (results.hasNext) {
                  val bindings = results.next()
                  val pred = bindings.getValue("p").stringValue()
                  val count = bindings.getValue("count").stringValue().toInt
                  if (count > edgeRenderer.groupPredsIfCountExceed)
                    predCount.addOne((pred, count))
                }
                predCount.toMap
              } match {
                case Success(value) => value
                case Failure(e) => throw e
              }
            } else Map.empty

          val predCountFilter = predCount map { p => s"FILTER (?p != <${p._1}>) " } mkString ""

          val graphPattern = "GRAPH ?g { " +
            "   ?s ?p ?o " +
            objFilter +
            (if (pred.isEmpty) predsFilter + predCountFilter else "") +
            " }"

          val countQ = s"SELECT ${if (pred.isEmpty) "('' AS ?p) " else ""} (COUNT(*) as ?o) ${if (graph.isEmpty) "(<sesame:nil> AS ?g) " else ""} " +
            "WHERE { " +
            graphPattern +
            s" }"

          val mainQ =
            s"SELECT ${if (pred.isEmpty) "?p" else ""} ?o ${if (graph.isEmpty) "?g" else ""} " +
              "WHERE { " +
              graphPattern +
              s" } LIMIT $lim OFFSET $off"

          val q = s"SELECT * { { $countQ } UNION { $mainQ } }"

          Using(repo.getConnection) { conn =>
            val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
            tq.setBinding("s", subjIri)
            if (graph.isDefined) {
              tq.setBinding("g", f.createIRI(graph.get))
            }
            if (pred.isDefined) {
              tq.setBinding("p", f.createIRI(pred.get))
            }
            val results = tq.evaluate
            val triples = new ListBuffer[Triple]
            var total = -1
            while (results.hasNext) {
              val bindings = results.next()
              if (total < 0) {
                total = bindings.getValue("o").stringValue().toInt
              } else {
                val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
                val p = ValueUtils.createValue(projectId, Some(g),
                  if (pred.isEmpty) bindings.getBinding("p").getValue else f.createIRI(pred.get))
                val o = ValueUtils.createValue(projectId, Some(g), bindings.getBinding("o").getValue)
                val triple = Triple(projectId, Some(g), s.asInstanceOf[IRI], p.asInstanceOf[IRI], o)
                triples.addOne(triple)
              }
            }

            predCount foreach { pc =>
              val p = ValueUtils.createValue(projectId, Some("sesame:nil"), f.createIRI(pc._1))
              val o = ValueUtils.createCompoundNode(projectId, Some("sesame:nil"),
                s"$compoundNodePrefix${Objects.hash(s.value, pc._1)}", s.value, p.value, pc._2.toString)
              val triple = Triple(projectId, Some("sesame:nil"), s.asInstanceOf[IRI], p.asInstanceOf[IRI], o)
              triples.addOne(triple)
            }

            TriplePage(triples.toSeq, lim, off, total)

          } match {
            case Success(value) => value
            case Failure(e) => throw e
          }
        case None => throw ProjectNotFoundException(projectId)
      }
    }
  }

  override def findTriplesToNode(projectId: String, graph: Option[String], obj: String): Future[Seq[Triple]] = {
    projectService.findRepoById(projectId) map {
      case Some((_, repo)) =>
        val f = repo.getValueFactory
        val q =
          "SELECT ?s ?p " + (if (graph.isEmpty) "?g" else "") + " WHERE { " +
            "GRAPH ?g { " +
            "  ?s ?p ?o " +
            "}}"
        val objIRI = f.createIRI(obj)
        val o = ValueUtils.createValue(projectId, graph, objIRI)
        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          tq.setBinding("o", objIRI)
          graph match {
            case Some(iri) => tq.setBinding("g", f.createIRI(iri))
            case _ =>
          }
          val results = tq.evaluate
          val triples = new ListBuffer[Triple]
          while (results.hasNext) {
            val bindings = results.next()
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            val s = ValueUtils.createValue(projectId, Some(g), bindings.getBinding("s").getValue)
            val p = ValueUtils.createValue(projectId, Some(g), bindings.getBinding("p").getValue)
            val triple = Triple(projectId, Some(g), s.asInstanceOf[IRI], p.asInstanceOf[IRI], o)
            triples.addOne(triple)
          }
          triples.toSeq
        } match {
          case Success(value) => value
          case Failure(e) => throw e
        }
      case None => throw ProjectNotFoundException(projectId)
    }
  }

  override def search(projectId: String, graph: Option[String], term: String,
                      limit: Option[Int], offset: Option[Int], queryType: QueryType,
                      additionalBindings: Map[String, String] = Map.empty): Future[SearchResult] =

    projectService.findRepoById(projectId).map {
      case Some((proj, repo)) =>
        Using(repo.getConnection) { conn =>

          val (lim, off) = calcLimitOffset(limit, offset)

          val q = queryFactory.getSearchQuery(queryType, proj, graph, term, limit, offset)
          val f = repo.getValueFactory

          val searchHits = new ListBuffer[SearchHit]

          val tq = proj.repository.`type` match {
            case RepositoryType.Virtuoso =>
              conn.prepareTupleQuery(QueryLanguage.SPARQL,
                q.replace(
                  "?term",
                  s"""\"${term.split(" ").map(s => s"'${s.trim}'").mkString(" AND ")}\""""))
            case _ =>
              val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
              tq.setBinding("term", f.createLiteral(s"${term.trim}*"))
              tq
          }
          additionalBindings.foreach(b => tq.setBinding(b._1, f.createIRI(b._2)))

          val results = tq.evaluate

          var total = -1
          while (results.hasNext) {
            val bindings = results.next()
            if (total < 0) { // a hack to retrieve total number of results. the first row contains the count
              total = bindings.getValue("s").stringValue().toInt
            } else {
              val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
              val s = bindings.getValue("s")
              if (!searchHits.map(s => s.node.value).contains(s.stringValue())) {
                val snippet = bindings.getValue("snippet").stringValue()
                val score = bindings.getValue("sc").stringValue()
                val node = ValueUtils.createValue(projectId, Some(g), s)
                val searchHit = SearchHit(node.asInstanceOf[IRI], score.toDouble, snippet)
                searchHits.addOne(searchHit)
              }
            }
          }

          SearchResult(searchHits.toSeq, lim, off, total)
        } match {
          case Success(value) => value
          case Failure(e) => throw e
        }
      case None => throw ProjectNotFoundException(projectId)
    }

  override def searchSubjs(projectId: String, graph: Option[String], term: String, limit: Option[Int], offset: Option[Int]): Future[SearchResult]
  = search(projectId: String, graph: Option[String], term: String, limit: Option[Int], offset: Option[Int], QueryType.SearchSubjs)

  override def searchPreds(projectId: String, graph: Option[String], term: String, limit: Option[Int], offset: Option[Int]): Future[SearchResult]
  = search(projectId: String, graph: Option[String], term: String, limit: Option[Int], offset: Option[Int], QueryType.SearchPreds)

  override def searchObjs(projectId: String, graph: Option[String], term: String,
                          limit: Option[Int], offset: Option[Int], subj: String, pred: String): Future[SearchResult]
  = search(projectId: String, graph: Option[String], term: String, limit: Option[Int], offset: Option[Int],
    QueryType.SearchObjs, HashMap("s1" -> subj, "s2" -> pred))

  override def findPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]] =
    projectService.findRepoById(projectId) map {
      case Some((_, repo)) =>

        val prefLang = HashMap("en" -> 0, "en-us" -> 1, "en-au" -> 2)

        val f = repo.getValueFactory

        val purlTitle = f.createIRI("http://purl.org/dc/elements/1.1/title")
        val predicates = ASN.statementNotation :: DCTERMS.TITLE :: ASN.statementLabel :: DBO.birthName :: RDFS.LABEL :: purlTitle :: SKOS.PREF_LABEL :: FOAF.NAME :: Nil

        Using(repo.getConnection) { conn =>
          val query = Queries.SELECT()
          val node = f.createIRI(nodeUri)

          val optionalPatterns = predicates.zipWithIndex.map { case (predicate, idx) =>
            val label = SparqlBuilder.`var`(s"label$idx")
            query.select(label)
            GraphPatterns.optional(GraphPatterns.tp(node, predicate, label))
          }

          query.where(optionalPatterns: _*)

          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, query.getQueryString)
          val results = tq.evaluate
          var prefLabel = Option.empty[Literal]
          var currentLang = Int.MaxValue
          while (results.hasNext) {
            val bindings = results.next().iterator()
            while (bindings.hasNext) {
              val value = bindings.next().getValue
              value match {
                case literal: model.Literal =>
                  if (prefLabel.isEmpty) {
                    if (literal.getLanguage.isPresent) {
                      currentLang = prefLang.getOrElse(literal.getLanguage.get().toLowerCase(), Int.MaxValue)
                    }
                    prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                  } else {
                    if (literal.getLanguage.isPresent) {
                      if (currentLang > prefLang.getOrElse(literal.getLanguage.get().toLowerCase(), Int.MaxValue)) {
                        currentLang = prefLang.getOrElse(literal.getLanguage.get().toLowerCase(), Int.MaxValue)
                        prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                      }
                    } else if (currentLang == Int.MaxValue) {
                      prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                    }
                  }
                case _ =>
              }
            }
          }

          if (prefLabel.isEmpty) {
            var separator = nodeUri.lastIndexOf("#")
            if (nodeUri.lastIndexOf("/") > separator) {
              separator = nodeUri.lastIndexOf("/")
            }
            if (separator < 0)
              separator = 0
            if (separator < nodeUri.length - 1) {
              prefLabel = Some(Literal(projectId, None, nodeUri.substring(separator + 1), None, None))
            } else {
              prefLabel = Some(Literal(projectId, None, "", None, None))
            }
          }
          prefLabel
        } match {
          case Success(value) => value
          case Failure(e) => throw e
        }
      case None => throw ProjectNotFoundException(projectId)
    }

  override def findGraphs(projectId: String): Future[Seq[GraphGet]] = projectService.findRepoById(projectId) map {
    case Some((_, repo)) =>
      val q = "SELECT DISTINCT ?g WHERE { " +
        "GRAPH ?g { " +
        " ?s ?p ?o " +
        "}}"

      val graphs = new ListBuffer[GraphGet]
      Using(repo.getConnection) { conn =>
        val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
        val results = tq.evaluate()
        while (results.hasNext) {
          val bindings = results.next()
          val graph = GraphGet(projectId, bindings.getBinding("g").getValue.stringValue())
          graphs.addOne(graph)
        }
      }
      graphs.toSeq
    case None => throw ProjectNotFoundException(projectId)
  }

  override def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]
  = projectService.findRepoById(projectId) map {
    case Some((_, repo)) =>
      val f = repo.getValueFactory
      Using(repo.getConnection) { conn =>
        graphs.foreach(g => conn.clear(f.createIRI(g)))
      }
      graphs.map(g => GraphGet(projectId, g))
    case None => throw ProjectNotFoundException(projectId)
  }

  override def findDepiction(projectId: String, nodeUri: String): Future[Option[IRI]]
  = projectService.findRepoById(projectId).map {
    case Some((_, repo)) =>
      val f = repo.getValueFactory

      val predicates = FOAF.DEPICTION :: Nil

      Using(repo.getConnection) { conn =>
        val query = Queries.SELECT()
        val node = f.createIRI(nodeUri)

        val optionalPatterns = predicates.zipWithIndex.map { case (predicate, idx) =>
          val label = SparqlBuilder.`var`(s"depiction$idx")
          query.select(label)
          GraphPatterns.optional(GraphPatterns.tp(node, predicate, label))
        }

        query.where(optionalPatterns: _*)

        val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, query.getQueryString)
        val results = tq.evaluate
        var depiction = Option.empty[IRI]
        while (results.hasNext) {
          val bindings = results.next()
          bindings.forEach(binding => {
            val iri = binding.getValue.asInstanceOf[org.eclipse.rdf4j.model.IRI]
            depiction = Some(ValueUtils.createValue(projectId, None, iri).asInstanceOf[IRI])
          })
        }
        depiction
      } match {
        case Success(value) => value
        case Failure(e) => throw e
      }
    case None => Option.empty[IRI]
  }

  def calcLimitOffset(limit: Option[Int], offset: Option[Int]): (Int, Int) = {
    val lim = limit match {
      case Some(value) => if (value > 10000 || value < 0) 10000 else value
      case None => 10000
    }

    val off = offset match {
      case Some(value) => if (value < 0) 0 else value
      case _ => 0
    }
    (lim, off)
  }

  override def deleteTriple(projectId: String,
                            graph: String, subj: String, pred: String,
                            objType: String, objValue: String, lang: Option[String],
                            dataType: Option[String]): Future[Triple] = projectService.findRepoById(projectId) map {
    case Some((_, repo)) =>
      val f = repo.getValueFactory
      Using(repo.getConnection) { conn =>
        val obj = if ("iri".equals(objType.toLowerCase)) {
          f.createIRI(objValue)
        } else {
          if (lang.isDefined) {
            f.createLiteral(objValue, lang.get)
          } else if (dataType.isDefined) {
            f.createLiteral(objValue, f.createIRI(dataType.get))
          } else {
            f.createLiteral(objValue)
          }
        }
        conn.remove(f.createIRI(subj), f.createIRI(pred), obj, f.createIRI(graph))

      } match {
        case Success(_) =>
          val obj = if ("iri".equals(objType.toLowerCase)) {
            IRI(projectId, Some(graph), objValue)
          } else {
            Literal(projectId, Some(graph), objValue, lang, dataType)
          }
          Triple(projectId, Some(graph),
            subj = IRI(projectId, Some(graph), subj),
            pred = IRI(projectId, Some(graph), pred),
            obj = obj)
        case Failure(e) => throw e
      }
    case None => throw ProjectNotFoundException(projectId)
  }
}
