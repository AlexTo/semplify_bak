package modules.sparql.controllers

import javax.inject.{Inject, Singleton}
import modules.security.services.ProfileService
import modules.sparql.models.{QueryCreate, QueryUpdate}
import modules.sparql.services.QueryService
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}

import scala.concurrent.ExecutionContext

@Singleton
class QueryController @Inject()(profileService: ProfileService,
                                queryService: QueryService,
                                cc: ControllerComponents)
                               (implicit ec: ExecutionContext) extends AbstractController(cc) {
  def create(): Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val profile = profileService.getProfile(request).get
    val queryCreate = request.body.as[QueryCreate]
    queryService.create(queryCreate, profile.getUsername) map { query =>
      Ok(Json.toJson(query))
    }
  }

  def update(): Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val profile = profileService.getProfile(request).get
    val queryUpdate = request.body.as[QueryUpdate]
    queryService.update(queryUpdate, profile.getUsername) map { query =>
      Ok(Json.toJson(query))
    }
  }

  def findAll(projectId: String): Action[AnyContent] = Action.async { _ =>
    queryService.findAll(projectId) map { queries =>
      Ok(Json.toJson(queries))
    }
  }
}
