package modules.triplestore.models

import play.api.libs.json.{Json, OWrites, Reads}

case class RDFImportParams(fileId: String,
                           baseURI: String,
                           graph: String,
                           replaceGraph: Option[Boolean])

object RDFImportParams {
  implicit val reads: Reads[RDFImportParams] = Json.reads[RDFImportParams]
  implicit val writes: OWrites[RDFImportParams] = Json.writes[RDFImportParams]
}
