package modules.fileserver.services.impl

import java.io.{BufferedInputStream, FileInputStream}
import java.nio.file.Paths

import akka.stream.Materializer
import javax.inject.Inject
import modules.fileserver.models.{File, FileInfo}
import modules.fileserver.services.FileService
import play.api.libs.Files
import play.api.mvc.MultipartFormData
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.akkastream.{GridFSStreams, State}
import reactivemongo.api.DefaultDB
import reactivemongo.api.bson.{BSONDocument, BSONObjectID}
import reactivemongo.api.gridfs.GridFS

import scala.concurrent.{ExecutionContext, Future}

class FileServiceImpl @Inject()(val reactiveMongoApi: ReactiveMongoApi)
                               (implicit ec: ExecutionContext, m: Materializer) extends FileService {

  val db: Future[DefaultDB] = reactiveMongoApi.database

  override def save(file: MultipartFormData.FilePart[Files.TemporaryFile]): Future[FileInfo] = {
    db.flatMap(db => {
      val gridFS = GridFS(db)
      val filename = Paths.get(file.filename).getFileName.toString
      val contentType = file.contentType
      val fileToSave = gridFS.fileToSave(Some(filename), contentType)
      val inputStream = new BufferedInputStream(new FileInputStream(file.ref.toFile))
      gridFS.writeFromInputStream(fileToSave, inputStream)
        .map(f => FileInfo(f.id.asInstanceOf[BSONObjectID].stringify, filename, contentType, f.length))
    })
  }

  override def get(id: String): Future[File] = {
    db.flatMap(db => {
      val gridFS = GridFS(db)

      gridFS.find(BSONDocument("_id" -> BSONObjectID.parse(id).get)).head.map { f =>
        val streams = GridFSStreams(gridFS)
        File(f.id.asInstanceOf[BSONObjectID].stringify,
          f.filename.get, f.contentType, f.length, streams.source(f))
      }
    })
  }
}

