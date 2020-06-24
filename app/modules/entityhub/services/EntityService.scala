package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.models.{GraphGet, IRI, Literal, SearchHit, SearchResult, Triple, TriplePage}
import modules.entityhub.services.impl.EntityServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[EntityServiceImpl])
trait EntityService {

  def findNode(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]

  def findTriplesFromNode(projectId: String, graph: Option[String],
                          subj: String, pred: Option[String], nodeType: Option[String],
                          currentUser: String,
                          limit: Option[Int] = Some(100),
                          offset: Option[Int] = Some(0)): Future[TriplePage]

  def findTriplesToNode(projectId: String, graph: Option[String], obj: String): Future[Seq[Triple]]

  def deleteTriple(projectId: String, graph: String,
                   subj: String, pred: String,
                   objType: String, objValue: String,
                   lang: Option[String],
                   dataType: Option[String]): Future[Triple]

  def insertTriple(projectId: String, graph: String,
                   subj: String, pred: String,
                   objType: String, objValue: String,
                   lang: Option[String],
                   dataType: Option[String]): Future[Triple]

  def search(projectId: String, graph: Option[String], term: String,
             limit: Option[Int], offset: Option[Int], queryType: QueryType,
             additionalBindings: Map[String, String]): Future[SearchResult]

  def searchSubjs(projectId: String, graph: Option[String], term: String,
                  limit: Option[Int], offset: Option[Int]): Future[SearchResult]

  def searchPreds(projectId: String, graph: Option[String], term: String,
                  limit: Option[Int], offset: Option[Int]): Future[SearchResult]

  def searchObjs(projectId: String, graph: Option[String], term: String,
                 limit: Option[Int], offset: Option[Int], subj: String, pred: String): Future[SearchResult]

  def findPrefLabel(projectId: String, nodeUri: String): Future[Option[Literal]]

  def findDepiction(projectId: String, nodeUri: String): Future[Option[IRI]]

  def findGraphs(projectId: String): Future[Seq[GraphGet]]

  def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]
}
