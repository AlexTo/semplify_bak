package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{IRI, Literal, Predicate, SearchHit}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: String, uri: String): Future[Option[IRI]]

  def findPredicatesFromNode(projectId: String, graph: String, from: String): Future[Seq[Predicate]]

  def findPredicatesToNode(projectId: String, graph: String, to: String): Future[Seq[Predicate]]

  def searchNodes(projectId: String, term: String): Future[Seq[SearchHit]]

  def getPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]]
}
