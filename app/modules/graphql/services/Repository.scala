package modules.graphql.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{Edge, Node, SearchHit}
import modules.graphql.services.impl.RepositoryImpl
import modules.project.models.ProjectGet

import scala.concurrent.Future
import scala.util.Try

@ImplementedBy(classOf[RepositoryImpl])
trait Repository {
  def node(projectId: String, graph: String, uri: String): Try[Option[Node]]

  def edgesFromNode(projectId: String, graph: String, from: String): Try[Seq[Edge]]

  def edgesToNode(projectId: String, graph: String, to: String): Try[Seq[Edge]]

  def projects(): Future[Seq[ProjectGet]]

  def searchNodes(projectId: String, term: String): Try[Seq[SearchHit]]

}
