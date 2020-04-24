package modules.fileserver.services

import com.google.inject.ImplementedBy
import modules.fileserver.models.{File, FileInfo}
import modules.fileserver.services.impl.FileServiceImpl
import play.api.libs.Files
import play.api.mvc.MultipartFormData

import scala.concurrent.Future

@ImplementedBy(classOf[FileServiceImpl])
trait FileService {
  def save(file: MultipartFormData.FilePart[Files.TemporaryFile], dataParts: Map[String, Seq[String]]): Future[FileInfo]

  def find(id: String): Future[File]

  def findInfo(id: String): Future[FileInfo]

  def findAll(projectId: String): Future[Seq[FileInfo]]
}
