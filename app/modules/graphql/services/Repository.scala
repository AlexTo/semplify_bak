package modules.graphql.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{IRI, Literal, Predicate, SearchHit}
import modules.graphql.services.impl.RepositoryImpl
import modules.project.models.ProjectGet

import scala.concurrent.Future

@ImplementedBy(classOf[RepositoryImpl])
trait Repository {
  def node(projectId: String, graph: String, uri: String): Future[Option[IRI]]

  def prefLabel(projectId: String, uri: String): Future[Option[Literal]]

  def predicatesFromNode(projectId: String, graph: String, from: String): Future[Seq[Predicate]]

  def predicatesToNode(projectId: String, graph: String, to: String): Future[Seq[Predicate]]

  def projects(): Future[Seq[ProjectGet]]

  def searchNodes(projectId: String, term: String): Future[Seq[SearchHit]]

}
