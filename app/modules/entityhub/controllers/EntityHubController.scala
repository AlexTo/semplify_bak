package modules.entityhub.controllers

import be.ugent.rml.store.RDF4JStore
import javax.inject.{Inject, Singleton}
import modules.entityhub.models.{IRI, Predicate}
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

  def test(dataFileId: String, mappingFileId: String, projectId: String, graph: String): Action[AnyContent] = Action.async { _ =>

    rmlService.execute(dataFileId, mappingFileId)
      .map(quadStore => {
        val rdf4JStore = quadStore.asInstanceOf[RDF4JStore]
        val model = rdf4JStore.getModel
        val repo = repositoryService.getRepository(projectId)
        val conn = repo.getConnection
        val f = conn.getValueFactory
        try {
          conn.add(model, f.createIRI(graph))
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
      val predicates = new ListBuffer[Predicate]
      val stmts = conn.getStatements(null, null, null)
      while (stmts.hasNext) {
        val stmt = stmts.next()
        val fromNode = ValueUtils.createValue(projectId, Some(stmt.getContext.stringValue()), stmt.getSubject)
        val toNode = ValueUtils.createValue(projectId, Some(stmt.getContext.stringValue()), stmt.getObject)
        val pred = Predicate(projectId, Some(stmt.getContext.stringValue()), stmt.getPredicate.stringValue(),
          fromNode.asInstanceOf[IRI], toNode)
        predicates.addOne(pred)
      }
      Ok(Json.toJson(predicates))
    } finally {
      conn.close()
    }
  }

}
