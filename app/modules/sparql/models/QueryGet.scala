package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class QueryGet(id: String,
                    projectId: String,
                    label: String,
                    description: Option[String],
                    createdBy: String,
                    modifiedBy: String,
                    created: Long,
                    modified: Long)

object QueryGet {
  implicit val reads: Reads[QueryGet] = Json.reads[QueryGet]
  implicit val writes: OWrites[QueryGet] = Json.writes[QueryGet]
}
