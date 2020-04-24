package modules.fileserver.models

import akka.stream.scaladsl.Source
import akka.util.ByteString
import reactivemongo.akkastream.State

import scala.concurrent.Future

case class File(id: String,
                filename: String,
                contentType: Option[String],
                length: Long,
                uploadDate: Option[Long],
                content: Source[ByteString, Future[State]])
