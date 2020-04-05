package modules.rml.models

import play.api.libs.json.{Json, OWrites, Reads}

case class MapFileRequest(dataFileId: String, mappingFileId: String)

object MapFileRequest {
  implicit val reads: Reads[MapFileRequest] = Json.reads[MapFileRequest]
  implicit val writes: OWrites[MapFileRequest] = Json.writes[MapFileRequest]
}
