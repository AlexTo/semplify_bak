package modules.fileserver.services

import com.google.inject.ImplementedBy
import modules.fileserver.models.{File, FileInfo}
import modules.fileserver.services.impl.FileServiceImpl
import play.api.libs.Files
import play.api.mvc.MultipartFormData

import scala.concurrent.Future

@ImplementedBy(classOf[FileServiceImpl])
trait FileService {
  def save(file: MultipartFormData.FilePart[Files.TemporaryFile],
           dataParts: Map[String, Seq[String]], username: String): Future[FileInfo]

  def findById(id: String): Future[File]

  def findInfoById(id: String): Future[FileInfo]

  def findAll(projectId: String): Future[Seq[FileInfo]]

  def delete(projectId: String, files: Seq[String]): Future[Seq[FileInfo]]
}
