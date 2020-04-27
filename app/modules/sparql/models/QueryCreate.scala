package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class QueryCreate(projectId: String,
                       title: String,
                       description: Option[String],
                       query: String)

object QueryCreate {
  implicit val reads: Reads[QueryCreate] = Json.reads[QueryCreate]
  implicit val writes: OWrites[QueryCreate] = Json.writes[QueryCreate]
}
