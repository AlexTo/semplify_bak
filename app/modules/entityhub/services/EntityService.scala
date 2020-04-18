package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{IRI, Literal, Predicate, SearchHit}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]

  def findPredicatesFromNode(projectId: String, graph: Option[String], from: String): Future[Seq[Predicate]]

  def findPredicatesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Predicate]]

  def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]

  def getPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]]
}
