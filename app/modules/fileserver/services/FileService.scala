package modules.fileserver.services

import com.google.inject.ImplementedBy
import modules.fileserver.models.{File, FileInfo}
import modules.fileserver.services.impl.FileServiceImpl
import play.api.libs.Files
import play.api.mvc.MultipartFormData

import scala.concurrent.Future

@ImplementedBy(classOf[FileServiceImpl])
trait FileService {
  def save(file: MultipartFormData.FilePart[Files.TemporaryFile]): Future[FileInfo]

  def get(id: String): Future[File]
}
