package modules.entityhub.controllers

import be.ugent.rml.store.RDF4JStore
import javax.inject.{Inject, Singleton}
import modules.entityhub.models.{Edge, Node}
import modules.entityhub.utils.ValueUtils
import modules.rml.services.RMLService
import modules.triplestore.services.RepositoryService
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.collection.mutable.ListBuffer
import scala.concurrent.ExecutionContext

@Singleton
class EntityHubController @Inject()(rmlService: RMLService,
                                    repositoryService: RepositoryService,
                                    cc: ControllerComponents)
                                   (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def test: Action[AnyContent] = Action.async { _ =>
    val dataFileId = "5e899e662201005a011baeb5"
    val mappingFileId = "5e899e6c2201005a011baeb6"
    val projectId = "5e8943b050040030a6ee3942"

    rmlService.execute(dataFileId, mappingFileId)
      .map(quadStore => {
        val rdf4JStore = quadStore.asInstanceOf[RDF4JStore]
        val model = rdf4JStore.getModel
        val repo = repositoryService.getRepository(projectId)
        val conn = repo.getConnection
        val f = conn.getValueFactory
        try {
          conn.add(model, f.createIRI("http://example.com"))
          Ok
        } finally {
          conn.close()
        }
      })
  }

  def test2: Action[AnyContent] = Action { request =>
    val projectId = "5e8943b050040030a6ee3942"
    val repo = repositoryService.getRepository(projectId)
    val conn = repo.getConnection
    try {
      val edges = new ListBuffer[Edge]
      val stmts = conn.getStatements(null, null, null)
      while (stmts.hasNext) {
        val stmt = stmts.next()
        val fromNode = ValueUtils.createNode(projectId, stmt.getContext.stringValue(), stmt.getSubject)
        val toNode = ValueUtils.createNode(projectId, stmt.getContext.stringValue(), stmt.getObject)
        val edge = Edge(projectId, stmt.getContext.stringValue(), stmt.getPredicate.stringValue(), fromNode, toNode)
        edges.addOne(edge)
      }
      Ok(Json.toJson(edges))
    } finally {
      conn.close()
    }

  }
}
