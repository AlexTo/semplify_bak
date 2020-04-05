package modules.fileserver.models

import play.api.libs.json.{Json, OWrites, Reads}

case class FileInfo(id: String, filename: String, contentType: Option[String], length: Long)

object FileInfo {
  implicit val writes: OWrites[FileInfo] = Json.writes[FileInfo]
  implicit val reads: Reads[FileInfo] = Json.reads[FileInfo]
}
