package modules.entityhub.services.impl

import javax.inject.Inject
import modules.entityhub.models.{Edge, Node, SearchHit}
import modules.entityhub.services.EntityService
import modules.entityhub.utils.ValueUtils
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.query.QueryLanguage

import scala.collection.mutable.ListBuffer
import scala.util.{Try, Using}


class EntityServiceImpl @Inject()(repositoryService: RepositoryService) extends EntityService {

  override def findNode(projectId: String, graph: String, uri: String): Try[Option[Node]] = {
    val repo = repositoryService.getRepository(projectId)

    Using(repo.getConnection) { conn =>
      Some(Node(projectId, graph, uri, "uri", Option.empty, Option.empty))
    }
  }

  override def findEdgesFromNode(projectId: String, graph: String, fromNodeUri: String): Try[Seq[Edge]] = {
    val repo = repositoryService.getRepository(projectId)
    val con = repo.getConnection

    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val sub = f.createIRI(fromNodeUri)
    val fromNode = ValueUtils.createNode(projectId, graph, sub)

    Using(repo.getConnection) { conn =>
      val statements = conn.getStatements(sub, null, null, context)
      val edges = new ListBuffer[Edge]
      while (statements.hasNext) {
        val statement = statements.next
        val pred = statement.getPredicate
        val obj = statement.getObject
        val toNode = ValueUtils.createNode(projectId, graph, obj)
        val edge = Edge(projectId, graph, pred.stringValue(), fromNode, toNode)
        edges.addOne(edge)
      }
      edges.toSeq
    }
  }

  override def findEdgesToNode(projectId: String, graph: String, toNodeUri: String): Try[Seq[Edge]] = {
    val repo = repositoryService.getRepository(projectId)

    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val obj = f.createIRI(toNodeUri)
    val toNode = ValueUtils.createNode(projectId, graph, obj)

    Using(repo.getConnection) { conn =>
      val statements = conn.getStatements(null, null, obj, context)
      val edges = new ListBuffer[Edge]
      while (statements.hasNext) {
        val statement = statements.next
        val pred = statement.getPredicate
        val sub = statement.getSubject
        val fromNode = ValueUtils.createNode(projectId, graph, sub)
        val edge = Edge(projectId, graph, pred.stringValue(), fromNode, toNode)
        edges.addOne(edge)
      }
      edges.toSeq
    }
  }

  override def searchNodes(projectId: String, term: String): Try[Seq[SearchHit]] = {
    val qry = "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
      "SELECT ?graph ?subj ?snippet ?score " +
      "WHERE { " +
      " GRAPH ?graph { " +
      "   ?subj ?pred ?obj . " +
      "   ?subj search:matches [" +
      "   search:query ?term ; " +
      "   search:score ?score; " +
      "   search:snippet ?snippet ] }} " +
      " LIMIT 20 ";

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
        val snippet = bindings.getValue("snippet").stringValue()
        val score = bindings.getValue("score").stringValue()
        val node = ValueUtils.createNode(projectId, graph, subj)
        val searchHit = SearchHit(node, score.toDouble, snippet)
        searchHits.addOne(searchHit)
      }
      searchHits.toSeq
    }
  }
}
