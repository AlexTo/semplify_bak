package modules.entityhub.services.impl

import javax.inject.Inject
import modules.entityhub.models.{GraphGet, IRI, Literal, Predicate, SearchHit}
import modules.entityhub.services.EntityService
import modules.entityhub.utils.ValueUtils
import modules.project.services.ProjectService
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.model.vocabulary.{FOAF, RDF, RDFS, SKOS}
import org.eclipse.rdf4j.query.QueryLanguage
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder
import org.eclipse.rdf4j.sparqlbuilder.core.query.Queries
import org.eclipse.rdf4j.sparqlbuilder.graphpattern.GraphPatterns

import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Success, Using}

class EntityServiceImpl @Inject()(repositoryService: RepositoryService,
                                  projectService: ProjectService)
                                 (implicit val ec: ExecutionContext) extends EntityService {

  override def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]] = {
    projectService.findById(projectId) map {
      case Some(_) =>
        val repo = repositoryService.getRepository(projectId)
        val f = repo.getValueFactory
        val q =
          "SELECT ?s " + (if (graph.isEmpty) "?g" else "") +
            " WHERE { " +
            "  GRAPH ?g { " +
            "   ?s ?p ?o " +
            "}}"

        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          graph match {
            case Some(iri) => tq.setBinding("g", f.createIRI(iri))
            case _ =>
          }
          val results = tq.evaluate
          if (results.hasNext) {
            val bindings = results.next
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            val s = bindings.getBinding("s").getValue
            Some(ValueUtils.createValue(projectId, Some(g), s).asInstanceOf[IRI])
          } else None
        } match {
          case Success(value) => value
        }
    }

  }

  override def findPredicatesFromNode(projectId: String, graph: Option[String], from: String): Future[Seq[Predicate]] =
    projectService.findById(projectId).map {
      case Some(_) =>
        val repo = repositoryService.getRepository(projectId)
        val f = repo.getValueFactory
        val q =
          "SELECT ?p ?o " + (if (graph.isEmpty) "?g" else "") +
            " WHERE { " +
            "  GRAPH ?g { " +
            "   ?s ?p ?o " +
            "}}"
        val subj = f.createIRI(from)
        val fromNode = ValueUtils.createValue(projectId, graph, subj)
        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          tq.setBinding("s", f.createIRI(from))
          graph match {
            case Some(iri) => tq.setBinding("g", f.createIRI(iri))
            case _ =>
          }
          val results = tq.evaluate
          val predicates = new ListBuffer[Predicate]
          while (results.hasNext) {
            val bindings = results.next()
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            val p = bindings.getBinding("p").getValue.stringValue()
            val o = ValueUtils.createValue(projectId, Some(g), bindings.getBinding("o").getValue)
            val predicate = Predicate(projectId, Some(g), p, fromNode.asInstanceOf[IRI], o)
            predicates.addOne(predicate)
          }
          predicates.toSeq
        } match {
          case Success(value) => value
        }
    }

  override def findPredicatesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Predicate]] = {
    projectService.findById(projectId).map {
      case Some(_) =>
        val repo = repositoryService.getRepository(projectId)
        val f = repo.getValueFactory
        val q =
          "SELECT ?s ?p " + (if (graph.isEmpty) "?g" else "") + " WHERE { " +
            "GRAPH ?g { " +
            "  ?s ?p ?o " +
            "}}"
        val obj = f.createIRI(to)
        val toNode = ValueUtils.createValue(projectId, graph, obj)
        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          tq.setBinding("o", f.createIRI(to))
          graph match {
            case Some(iri) => tq.setBinding("g", f.createIRI(iri))
            case _ =>
          }
          val results = tq.evaluate
          val predicates = new ListBuffer[Predicate]
          while (results.hasNext) {
            val bindings = results.next()
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            val p = bindings.getBinding("p").getValue.stringValue()
            val s = ValueUtils.createValue(projectId, Some(g), bindings.getBinding("s").getValue)
            val predicate = Predicate(projectId, Some(g), p, s.asInstanceOf[IRI], toNode)
            predicates.addOne(predicate)
          }
          predicates.toSeq
        } match {
          case Success(value) => value
        }
    }
  }

  override def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]] =
    projectService.findById(projectId).map {
      case Some(_) =>
        val q = "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
          "SELECT ?s ?score ?snippet " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          "  GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?s search:matches [" +
          "   search:query ?term ; " +
          "   search:score ?score; " +
          "   search:snippet ?snippet ] }} " +
          "LIMIT 20 "

        val repo = repositoryService.getRepository(projectId)
        val f = repo.getValueFactory

        Using(repo.getConnection) { conn =>
          val searchHits = new ListBuffer[SearchHit]
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, q)
          tq.setBinding("term", f.createLiteral(term.trim + "*"))
          val results = tq.evaluate
          while (results.hasNext) {
            val bindings = results.next()
            val g = if (graph.isEmpty) bindings.getBinding("g").getValue.stringValue() else graph.get
            val s = bindings.getValue("s")
            if (!searchHits.map(s => s.node.value).contains(s.stringValue())) {
              val snippet = bindings.getValue("snippet").stringValue()
              val score = bindings.getValue("score").stringValue()
              val node = ValueUtils.createValue(projectId, Some(g), s)
              val searchHit = SearchHit(node.asInstanceOf[IRI], score.toDouble, snippet)
              searchHits.addOne(searchHit)
            }
          }
          searchHits.toSeq
        } match {
          case Success(value) => value
        }
    }

  override def findPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]] =
    projectService.findById(projectId).map {
      case Some(_) =>
        val repo = repositoryService.getRepository(projectId)
        val f = repo.getValueFactory

        val purlTitle = f.createIRI("http://purl.org/dc/elements/1.1/title")
        val predicates = RDFS.LABEL :: purlTitle :: SKOS.PREF_LABEL :: FOAF.NAME :: Nil

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
          while (results.hasNext) {
            val bindings = results.next()
            bindings.forEach(binding => {
              val literal = binding.getValue.asInstanceOf[org.eclipse.rdf4j.model.Literal]
              val lang = literal.getLanguage.orElse(null)
              if (lang == null) {
                prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
              } else if (lang.equalsIgnoreCase("en")) {
                if (prefLabel.isEmpty || (prefLabel.get.lang.isDefined && !"en".equalsIgnoreCase(prefLabel.get.lang.get))) {
                  prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                }
              } else if (lang.toLowerCase().startsWith("en")) {
                if (prefLabel.isEmpty || (prefLabel.get.lang.isDefined && !"en".equalsIgnoreCase(prefLabel.get.lang.get))) {
                  prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                }
              } else {
                if (prefLabel.isEmpty || (prefLabel.get.lang.isDefined && !prefLabel.get.lang.get.toLowerCase().startsWith("en"))) {
                  prefLabel = Some(ValueUtils.createValue(projectId, None, literal).asInstanceOf[Literal])
                }
              }
            })
          }

          if (prefLabel.isEmpty) {
            var separator = nodeUri.lastIndexOf("#")
            if (nodeUri.lastIndexOf("/") > separator) {
              separator = nodeUri.lastIndexOf("/")
            }
            if (separator < 0)
              separator = 0
            if (separator < nodeUri.length - 1) {
              prefLabel = Some(Literal(projectId, None, nodeUri.substring(separator + 1), None, RDF.LANGSTRING.stringValue()))
            } else {
              prefLabel = Some(Literal(projectId, None, "", None, RDF.LANGSTRING.stringValue()))
            }
          }
          prefLabel
        } match {
          case Success(value) => value
        }
      case None => Option.empty[Literal]
    }

  override def findGraphs(projectId: String): Future[Seq[GraphGet]] = projectService.findById(projectId) map {
    case Some(_) =>
      val q = "SELECT DISTINCT ?g WHERE { " +
        "GRAPH ?g { " +
        " ?s ?p ?o " +
        "}}"

      val repo = repositoryService.getRepository(projectId)
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
  }

  override def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]] = projectService.findById(projectId) map {
    case Some(_) =>
      val repo = repositoryService.getRepository(projectId)
      val f = repo.getValueFactory
      Using(repo.getConnection) { conn =>
        graphs.foreach(g => conn.clear(f.createIRI(g)))
      }
      graphs.map(g => GraphGet(projectId, g))
  }
}
