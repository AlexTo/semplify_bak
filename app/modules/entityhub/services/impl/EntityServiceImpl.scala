package modules.entityhub.services.impl

import javax.inject.Inject
import modules.entityhub.models.{IRI, Literal, Predicate, SearchHit}
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

  override def findNode(projectId: String, graph: String, uri: String): Future[Option[IRI]] = Future {
    val repo = repositoryService.getRepository(projectId)
    Using(repo.getConnection) { conn =>
      Some(IRI(projectId, Some(graph), uri))
    } match {
      case Success(value) => value
    }
  }

  override def findPredicatesFromNode(projectId: String, graph: String, from: String): Future[Seq[Predicate]] = Future {
    val repo = repositoryService.getRepository(projectId)
    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val sub = f.createIRI(from)
    val fromNode = ValueUtils.createValue(projectId, Some(graph), sub)

    Using(repo.getConnection) { conn =>
      val statements = conn.getStatements(sub, null, null, context)
      val predicates = new ListBuffer[Predicate]
      while (statements.hasNext) {
        val statement = statements.next
        val pred = statement.getPredicate
        val obj = statement.getObject
        val toNode = ValueUtils.createValue(projectId, Some(graph), obj)
        val predicate = Predicate(projectId, Some(graph), pred.stringValue(), fromNode.asInstanceOf[IRI], toNode)
        predicates.addOne(predicate)
      }
      predicates.toSeq
    } match {
      case Success(value) => value
    }
  }

  override def findPredicatesToNode(projectId: String, graph: String, to: String): Future[Seq[Predicate]] = Future {
    val repo = repositoryService.getRepository(projectId)

    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val obj = f.createIRI(to)
    val toNode = ValueUtils.createValue(projectId, Some(graph), obj)

    Using(repo.getConnection) { conn =>
      val statements = conn.getStatements(null, null, obj, context)
      val predicates = new ListBuffer[Predicate]
      while (statements.hasNext) {
        val statement = statements.next
        val pred = statement.getPredicate
        val sub = statement.getSubject
        val fromNode = ValueUtils.createValue(projectId, Some(graph), sub)
        val predicate = Predicate(projectId, Some(graph), pred.stringValue(), fromNode.asInstanceOf[IRI], toNode)
        predicates.addOne(predicate)
      }
      predicates.toSeq
    } match {
      case Success(value) => value
    }
  }

  override def searchNodes(projectId: String, term: String): Future[Seq[SearchHit]] = Future {
    val qry = "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
      "SELECT ?graph ?subj ?score ?snippet " +
      "WHERE { " +
      " GRAPH ?graph { " +
      "   ?subj ?pred ?obj . " +
      "   ?subj search:matches [" +
      "   search:query ?term ; " +
      "   search:score ?score; " +
      "   search:snippet ?snippet ] }} " +
      " LIMIT 20 "

    val repo = repositoryService.getRepository(projectId)
    val f = repo.getValueFactory

    Using(repo.getConnection) { conn =>
      val searchHits = new ListBuffer[SearchHit]
      val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, qry)
      tq.setBinding("term", f.createLiteral(term.trim + "*"))
      val results = tq.evaluate
      while (results.hasNext) {
        val bindings = results.next()
        val graph = bindings.getValue("graph").stringValue()
        val subj = bindings.getValue("subj")
        if (!searchHits.map(s => s.node.value).contains(subj.stringValue())) {
          val snippet = bindings.getValue("snippet").stringValue()
          val score = bindings.getValue("score").stringValue()
          val node = ValueUtils.createValue(projectId, Some(graph), subj)
          val searchHit = SearchHit(node.asInstanceOf[IRI], score.toDouble, snippet)
          searchHits.addOne(searchHit)
        }
      }
      searchHits.toSeq
    } match {
      case Success(value) => value
    }
  }

  override def getPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]] = {
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
              separator = nodeUri.lastIndexOf("/") + 1
              if (separator < 0)
                separator = 0
              if (separator < nodeUri.length) {
                prefLabel = Some(Literal(projectId, None, nodeUri.substring(separator), None, RDF.LANGSTRING.stringValue()))
              }
            }
          }
          prefLabel
        } match {
          case Success(value) => value
        }
      case None => Option.empty[Literal]
    }
  }
}
