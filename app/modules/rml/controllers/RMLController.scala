package modules.rml.controllers

import javax.inject.{Inject, Singleton}
import modules.rml.models.MapFileRequest
import modules.rml.services.RMLService
import play.api.libs.json.{JsString, JsValue, Json}
import play.api.mvc.{AbstractController, Action, ControllerComponents, Request}

import scala.concurrent.ExecutionContext

@Singleton
class RMLController @Inject()(rmlService: RMLService, cc: ControllerComponents)
                             (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def execute: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val json = request.body
    val mapFileRequest = json.as[MapFileRequest]

    rmlService.executeAsString(mapFileRequest.dataFileId, mapFileRequest.mappingFileId, "turtle")
      .map(s => Ok(Json.obj({
        "rdf" -> JsString(s)
      })))
  }
}
