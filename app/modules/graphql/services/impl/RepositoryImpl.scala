package modules.graphql.services.impl

import javax.inject.Inject
import modules.entityhub.models.{Edge, Node, SearchHit}
import modules.entityhub.services.EntityService
import modules.graphql.services.Repository
import modules.project.models.ProjectGet
import modules.project.services.ProjectService

import scala.concurrent.Future
import scala.util.Try

class RepositoryImpl @Inject()(entityService: EntityService, projectService: ProjectService) extends Repository {
  override def node(projectId: String, graph: String, uri: String): Try[Option[Node]] = entityService.findNode(projectId, graph, uri)

  override def edgesFromNode(projectId: String, graph: String, from: String): Try[Seq[Edge]] = entityService.findEdgesFromNode(projectId, graph, from)

  override def edgesToNode(projectId: String, graph: String, to: String): Try[Seq[Edge]] = entityService.findEdgesToNode(projectId, graph, to)

  override def projects(): Future[Seq[ProjectGet]] = projectService.findAll

  override def searchNodes(projectId: String, term: String): Try[Seq[SearchHit]] = entityService.searchNodes(projectId, term)
}
