package modules.entityhub.services.impl

import javax.inject.Inject
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.services.EntityService
import modules.entityhub.utils.ValueUtils
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.query.QueryLanguage

import scala.collection.mutable.ListBuffer


class EntityServiceImpl @Inject()(repositoryService: RepositoryService) extends EntityService {
  override def findNode(projectId: String, graph: String, uri: String): Option[Node] = {
    val repo = repositoryService.getRepository(projectId)
    val f = repo.getValueFactory

    val con = repo.getConnection
    try {
      Some(Node(projectId, graph, uri, "uri", Option.empty, Option.empty))
    } finally {
      con.close()
    }
  }

  override def findEdgesFromNode(projectId: String, graph: String, fromNodeUri: String): Seq[Edge] = {
    val repo = repositoryService.getRepository(projectId)
    val con = repo.getConnection

    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val sub = f.createIRI(fromNodeUri)
    val fromNode = ValueUtils.createNode(projectId, graph, sub)

    try {
      val statements = con.getStatements(sub, null, null, context)
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

    } finally {
      con.close()
    }
  }

  override def findEdgesToNode(projectId: String, graph: String, toNodeUri: String): Seq[Edge] = {
    val repo = repositoryService.getRepository(projectId)
    val con = repo.getConnection

    val f = repo.getValueFactory
    val context = f.createIRI(graph)
    val obj = f.createIRI(toNodeUri)
    val toNode = ValueUtils.createNode(projectId, graph, obj)

    try {
      val statements = con.getStatements(null, null, obj, context)
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

    } finally {
      con.close()
    }
  }

  override def searchNodes(projectId: String, term: String): Seq[Node] = {
    val projectId = "5e8943b050040030a6ee3942"
    val qry = "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
      "SELECT ?subj ?text " +
      "WHERE { ?subj search:matches [" +
      " search:query ?term ; " +
      " search:snippet ?text ] } ";

    val repo = repositoryService.getRepository(projectId)

    val conn = repo.getConnection
    val f = conn.getValueFactory
    val nodes = new ListBuffer[Node]
    try {
      val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, qry)
      tq.setBinding("term", f.createLiteral("mat" + "*"))
      val results = tq.evaluate
      while (results.hasNext) {
        val bindings = results.next()
        val i = 0
      }
    } finally {
      conn.close()
    }
    nodes.toSeq
  }
}
