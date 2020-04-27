package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class QueryUpdate(id: String,
                       projectId: String,
                       label: String,
                       description: Option[String],
                       query: String)

object QueryUpdate {
  implicit val reads: Reads[QueryUpdate] = Json.reads[QueryUpdate]
  implicit val writes: OWrites[QueryUpdate] = Json.writes[QueryUpdate]
}
