package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{GraphGet, IRI, Literal, Predicate, SearchHit}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]

  def findPredicatesFromNode(projectId: String, graph: Option[String], from: String): Future[Seq[Predicate]]

  def findPredicatesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Predicate]]

  def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]

  def findPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]]

  def findGraphs(projectId: String): Future[Seq[GraphGet]]

  def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]
}
