package modules.graphql.services.impl

import javax.inject.Inject
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.services.EntityService
import modules.graphql.services.Repository

class RepositoryImpl @Inject()(entityService: EntityService) extends Repository {
  override def node(projectId: String, graph: String, uri: String): Option[Node] = entityService.findNode(projectId, graph, uri)

  override def edgesFromNode(projectId: String, graph: String, from: String): Seq[Edge] = entityService.findEdgesFromNode(projectId, graph, from)

  override def edgesToNode(projectId: String, graph: String, to: String): Seq[Edge] = entityService.findEdgesToNode(projectId, graph, to)
}
