package modules.system.controllers

import javax.inject.Inject
import modules.system.services.SettingsService
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class SettingsController @Inject()(settingsService: SettingsService)(cc: ControllerComponents)
                                  (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def findProjectSettings(projectId: String): Action[AnyContent] = Action.async { _ =>
    settingsService.findProjectSettings(projectId) map {
      projectSettings => Ok(Json.toJson(projectSettings))
    }
  }

  def findUserSettings(projectId: String, username: String): Action[AnyContent] = Action.async { _ =>
    settingsService.findUserSettings(projectId, username) map {
      projectSettings => Ok(Json.toJson(projectSettings))
    }
  }

}
