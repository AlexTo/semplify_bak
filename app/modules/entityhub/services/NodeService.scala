package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.services.impl.NodeServiceImpl

@ImplementedBy(classOf[NodeServiceImpl])
trait NodeService {

  def findNode(projectId: String, graph: String, uri: String): Option[Node]

  def findEdgesFromNode(projectId: String, graph: String, fromNodeUri: String): Seq[Edge]
}
