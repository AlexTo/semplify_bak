package modules.entityhub.controllers

import be.ugent.rml.store.RDF4JStore
import javax.inject.{Inject, Singleton}
import modules.entityhub.models.{IRI, Predicate}
import modules.entityhub.services.EntityService
import modules.entityhub.utils.ValueUtils
import modules.rml.services.RMLService
import modules.triplestore.services.RepositoryService
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.collection.mutable.ListBuffer
import scala.concurrent.ExecutionContext
import scala.util.Success

@Singleton
class EntityHubController @Inject()(rmlService: RMLService,
                                    repositoryService: RepositoryService,
                                    entityService: EntityService,
                                    cc: ControllerComponents)
                                   (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def test: Action[AnyContent] = Action.async { _ =>
    val dataFileId = "5e9713157b01007b01d2f421"
    val mappingFileId = "5e971bffb20000db005480a3"
    val projectId = "5e8943b050040030a6ee3942"

    rmlService.execute(dataFileId, mappingFileId)
      .map(quadStore => {
        val rdf4JStore = quadStore.asInstanceOf[RDF4JStore]
        val model = rdf4JStore.getModel
        val repo = repositoryService.getRepository(projectId)
        val conn = repo.getConnection
        val f = conn.getValueFactory
        try {
          conn.add(model, f.createIRI("http://thesaurus.education.nsw.gov.au/"))
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
