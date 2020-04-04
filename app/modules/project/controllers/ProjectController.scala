package modules.project.controllers

import javax.inject.{Inject, Singleton}
import modules.project.models.ProjectCreate
import modules.project.services.ProjectService
import modules.security.services.ProfileService
import modules.triplestore.services.RepositoryManager
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import reactivemongo.bson.BSONObjectID

import scala.concurrent.ExecutionContext

@Singleton
class ProjectController @Inject()(projectService: ProjectService,
                                  profileService: ProfileService,
                                  repositoryManager: RepositoryManager,
                                  val controllerComponents: ControllerComponents)
                                 (implicit ec: ExecutionContext) extends BaseController {

  def save: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>

    val profile = profileService.getProfile(request).get

    val json = request.body
    val project = json.as[ProjectCreate]
    projectService.save(project, profile.getUsername)
      .map(model => Ok(Json.toJson(model)))
      .recover(_ => InternalServerError)
  }
}