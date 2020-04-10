package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.services.impl.EntityServiceImpl

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: String, uri: String): Option[Node]

  def findEdgesFromNode(projectId: String, graph: String, fromNodeUri: String): Seq[Edge]

  def findEdgesToNode(projectId: String, graph: String, fromNodeUri: String): Seq[Edge]

  def searchNodes(projectId: String, term: String): Seq[Node]
}
