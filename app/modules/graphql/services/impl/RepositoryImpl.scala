package modules.graphql.services.impl

import javax.inject.Inject
import modules.entityhub.models.{IRI, Literal, Predicate, SearchHit}
import modules.entityhub.services.EntityService
import modules.graphql.services.Repository
import modules.project.models.ProjectGet
import modules.project.services.ProjectService

import scala.concurrent.Future

class RepositoryImpl @Inject()(entityService: EntityService, projectService: ProjectService) extends Repository {
  override def node(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]
  = entityService.findNode(projectId, graph, uri)

  override def predicatesFromNode(projectId: String, graph: Option[String], from: String): Future[Seq[Predicate]]
  = entityService.findPredicatesFromNode(projectId, graph, from)

  override def predicatesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Predicate]]
  = entityService.findPredicatesToNode(projectId, graph, to)

  override def projects(): Future[Seq[ProjectGet]]
  = projectService.findAll

  override def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]
  = entityService.searchNodes(projectId, graph, term)

  override def prefLabel(projectId: String, uri: String): Future[Option[Literal]]
  = entityService.getPrefLabel(projectId, uri)
}
