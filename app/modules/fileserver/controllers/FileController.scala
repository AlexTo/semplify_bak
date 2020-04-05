package modules.fileserver.controllers

import java.nio.file.Paths

import javax.inject.{Inject, Singleton}
import modules.fileserver.services.FileService
import play.api.libs.Files
import play.api.libs.json.Json
import play.api.mvc.{Action, BaseController, ControllerComponents, MultipartFormData}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class FileController @Inject()(fileService: FileService, val controllerComponents: ControllerComponents)
                              (implicit ec: ExecutionContext) extends BaseController {

  def upload: Action[MultipartFormData[Files.TemporaryFile]] = Action.async(parse.multipartFormData) { request =>
    request.body
      .file("file")
      .map { file =>

        fileService
          .save(file)
          .map(fileInfo => Ok(Json.toJson(fileInfo)))
          .recover(_ => InternalServerError)
      }.getOrElse(Future.successful(BadRequest))
  }
}
