package modules.entityhub.services.impl

import javax.inject.Inject
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.services.NodeService
import modules.entityhub.utils.ValueUtils
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.model.{BNode, IRI, Literal}

import scala.collection.mutable.ListBuffer
import scala.jdk.javaapi.OptionConverters


class NodeServiceImpl @Inject()(repositoryService: RepositoryService) extends NodeService {
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
}
