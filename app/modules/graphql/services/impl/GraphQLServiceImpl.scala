package modules.graphql.services.impl

import javax.inject.Inject
import modules.entityhub.models.{GraphGet, IRI, Literal, Triple, SearchHit}
import modules.entityhub.services.EntityService
import modules.fileserver.models.FileInfo
import modules.fileserver.services.FileService
import modules.graphql.services.GraphQLService
import modules.project.models.ProjectGet
import modules.project.services.ProjectService
import modules.sparql.models.QueryGet
import modules.sparql.services.QueryService
import modules.task.models.TaskGet
import modules.task.services.TaskService
import modules.webcrawler.models.PageGet
import modules.webcrawler.services.WebCrawlerService

import scala.concurrent.Future

class GraphQLServiceImpl @Inject()(entityService: EntityService,
                                   projectService: ProjectService,
                                   fileService: FileService,
                                   taskService: TaskService,
                                   queryService: QueryService,
                                   webCrawlerService: WebCrawlerService) extends GraphQLService {
  override def node(projectId: String, graph: Option[String], uri: String): Future[Option[IRI]]
  = entityService.findNode(projectId, graph, uri)

  override def triplesFromNode(projectId: String, graph: Option[String], from: String, nodeType: Option[String]): Future[Seq[Triple]]
  = entityService.findTriplesFromNode(projectId, graph, from, nodeType)

  override def triplesToNode(projectId: String, graph: Option[String], to: String): Future[Seq[Triple]]
  = entityService.findTriplesToNode(projectId, graph, to)

  override def projects(): Future[Seq[ProjectGet]]
  = projectService.findAll

  override def searchNodes(projectId: String, graph: Option[String], term: String): Future[Seq[SearchHit]]
  = entityService.searchNodes(projectId, graph, term)

  override def prefLabel(projectId: String, uri: String): Future[Option[Literal]]
  = entityService.findPrefLabel(projectId, uri)

  override def tasks(): Future[Seq[TaskGet]] = taskService.findAll

  override def crawledPages(projectId: String): Future[Seq[PageGet]] = webCrawlerService.findAllCrawledPages(projectId)

  override def files(projectId: String): Future[Seq[FileInfo]] = fileService.findAll(projectId)

  override def sparqlQueries(projectId: String): Future[Seq[QueryGet]] = queryService.findAll(projectId)

  override def graphs(projectId: String): Future[Seq[GraphGet]] = entityService.findGraphs(projectId)

  override def deleteGraphs(projectId: String, graphs: Seq[String]): Future[Seq[GraphGet]]
  = entityService.deleteGraphs(projectId, graphs)

  override def depiction(projectId: String, uri: String): Future[Option[IRI]] = entityService.findDepiction(projectId, uri)

  override def deleteFiles(projectId: String, fileIds: Seq[String]): Future[Seq[FileInfo]] = fileService.delete(projectId, fileIds)
}
