package modules.graphql.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{Edge, Node}
import modules.graphql.services.impl.RepositoryImpl

@ImplementedBy(classOf[RepositoryImpl])
trait Repository {
  def node(projectId: String, graph: String, uri: String): Option[Node]

  def edgesFromNode(projectId: String, graph: String, from: String): Seq[Edge]

  def edgesToNode(projectId: String, graph: String, to: String): Seq[Edge]

}
