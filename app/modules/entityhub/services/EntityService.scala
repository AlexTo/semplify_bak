package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.{GraphGet, IRI, Literal, Triple, SearchHit}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]

  def findTriplesFromNode(projectId: String, graph: Option[String],
                          subj: String, nodeType: Option[String], currentUser: String): Future[Seq[Triple]]

  def findTriplesToNode(projectId: String, graph: Option[String], obj: String): Future[Seq[Triple]]

  def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]

  def searchPreds(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]

  def findPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]]

  def findDepiction(projectId: String, nodeUri: String): Future[Option[IRI]]

  def findGraphs(projectId: String): Future[Seq[GraphGet]]

  def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]
}
