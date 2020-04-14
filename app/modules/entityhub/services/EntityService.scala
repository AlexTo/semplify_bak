package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{Edge, Node, SearchHit}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.util.Try

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: String, uri: String): Try[Option[Node]]

  def findEdgesFromNode(projectId: String, graph: String, fromNodeUri: String): Try[Seq[Edge]]

  def findEdgesToNode(projectId: String, graph: String, fromNodeUri: String): Try[Seq[Edge]]

  def searchNodes(projectId: String, term: String): Try[Seq[SearchHit]]
}
