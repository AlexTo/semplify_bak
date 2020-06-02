package modules.system.controllers

import javax.inject.Inject
import modules.system.models.SettingsUpdate
import modules.system.services.SettingsService
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}

import scala.concurrent.ExecutionContext

class SettingsController @Inject()(settingsService: SettingsService)(cc: ControllerComponents)
                                  (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def findSettings(projectId: String, username: Option[String]): Action[AnyContent] = Action.async { _ =>
    (username match {
      case Some(value) => settingsService.findUserSettings(projectId, value)
      case None => settingsService.findProjectSettings(projectId)
    }) map {
      s => Ok(Json.toJson(s))
    }
  }

  def update(settingsId: String): Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val settings = request.body.as[SettingsUpdate]
    settingsService.update(settingsId, settings) map {
      n => Ok(Json.toJson(n))
    }
  }

}
