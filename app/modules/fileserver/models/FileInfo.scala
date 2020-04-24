package modules.fileserver.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsObject, Json, OWrites, Reads, __}

case class FileInfo(id: String,
                    filename: String,
                    contentType: Option[String],
                    uploadDate: Option[Long],
                    metadata: JsObject)

object FileInfo {
  implicit val writes: OWrites[FileInfo] = Json.writes[FileInfo]
  implicit val reads: Reads[FileInfo] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "filename").read[String] and
      (__ \ "contentType").readNullable[String] and
      (__ \ "uploadDate" \ "$date").readNullable[Long] and
      (__ \ "metadata").read[JsObject]
    ) (FileInfo.apply _)
}
