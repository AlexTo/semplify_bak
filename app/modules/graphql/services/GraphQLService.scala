package modules.graphql.services

import com.google.inject.ImplementedBy
import modules.entityhub.models._
import modules.fileserver.models.FileInfo
import modules.graphql.services.impl.GraphQLServiceImpl
import modules.project.models.ProjectGet
import modules.sparql.models.QueryGet
import modules.system.entities.VisualGraph
import modules.system.models.SettingsGet
import modules.task.models.TaskGet
import modules.webcrawler.models.PageGet

import scala.concurrent.Future

@ImplementedBy(classOf[GraphQLServiceImpl])
trait GraphQLService {
  def node(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]

  def prefLabel(projectId: String, uri: String): Future[Option[Literal]]

  def depiction(projectId: String, uri: String): Future[Option[IRI]]

  def triplesFromNode(projectId: String, graph: Option[String],
                      subj: String, pred: Option[String],
                      nodeType: Option[String], currentUser: String,
                      limit: Option[Int], offset: Option[Int]): Future[TriplePage]

  def triplesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Triple]]

  def projects(): Future[Seq[ProjectGet]]

  def tasks(): Future[Seq[TaskGet]]

  def searchSubjs(projectId: String, graph: Option[String], term: String,
                  limit: Option[Int], offset: Option[Int]): Future[SearchResult]

  def searchPreds(projectId: String, graph: Option[String], term: String,
                  limit: Option[Int], offset: Option[Int]): Future[SearchResult]

  def searchObjs(projectId: String, graph: Option[String], term: String,
                 limit: Option[Int], offset: Option[Int], subj: String, pred: String): Future[SearchResult]

  def crawledPages(projectId: String): Future[Seq[PageGet]]

  def files(projectId: String): Future[Seq[FileInfo]]

  def settings(projectId: String, username: Option[String]): Future[SettingsGet]

  def updateVisualGraphSettings(settingsId: String, visualGraph: VisualGraph): Future[Int]

  def sparqlQueries(projectId: String): Future[Seq[QueryGet]]

  def graphs(projectId: String): Future[Seq[GraphGet]]

  def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]

  def deleteFiles(projectId: String, fileIds: Seq[String]): Future[Seq[FileInfo]]

  def deleteQueries(projectId: String, queryIds: Seq[String]): Future[Int]

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
}
