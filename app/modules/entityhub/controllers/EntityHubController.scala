package modules.entityhub.controllers

import be.ugent.rml.store.RDF4JStore
import javax.inject.{Inject, Singleton}
import modules.project.services.ProjectService
import modules.rml.services.RMLService
import play.api.Logger
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

@Singleton
class EntityHubController @Inject()(rmlService: RMLService,
                                    projectService: ProjectService,
                                    cc: ControllerComponents)
                                   (implicit ec: ExecutionContext) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  def test(dataFileId: String, mappingFileId: String, projectId: String, graph: String): Action[AnyContent]
  = Action.async { _ =>
    projectService.findRepoById(projectId) flatMap {
      case Some(repo) => rmlService.execute(dataFileId, mappingFileId)
        .map(quadStore => {
          val rdf4JStore = quadStore.asInstanceOf[RDF4JStore]
          val model = rdf4JStore.getModel
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
  }

}
