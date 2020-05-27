package modules.fileserver.controllers

import javax.inject.{Inject, Singleton}
import modules.fileserver.services.FileService
import modules.security.services.ProfileService
import play.api.libs.Files
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class FileController @Inject()(fileService: FileService, profileService: ProfileService,
                               cc: ControllerComponents)
                              (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def upload: Action[MultipartFormData[Files.TemporaryFile]] = Action.async(parse.multipartFormData) { request =>
    val profile = profileService.getProfile(request).get
    request.body
      .file("file")
      .map { file =>
        fileService
          .save(file, request.body.dataParts, profile.getUsername)
          .map(fileInfo => Ok(Json.toJson(fileInfo)))
          .recover(_ => InternalServerError)
      }.getOrElse(Future.successful(BadRequest))
  }

  def findAll(projectId: String): Action[AnyContent] = Action.async { _ =>
    fileService.findAll(projectId) map {
      files => Ok(Json.toJson(files))
    }
  }
}
