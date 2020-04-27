package modules.sparql.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, OWrites, Reads, __}

case class QueryGet(id: String,
                    projectId: String,
                    label: String,
                    description: Option[String],
                    createdBy: String,
                    modifiedBy: String,
                    created: Long,
                    modified: Long)

object QueryGet {
  implicit val writes: OWrites[QueryGet] = Json.writes[QueryGet]
  implicit val reads: Reads[QueryGet] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "projectId" \ "$oid").read[String] and
      (__ \ "label").read[String] and
      (__ \ "description").readNullable[String] and
      (__ \ "createdBy").read[String] and
      (__ \ "modifiedBy").read[String] and
      (__ \ "created" \ "$date").read[Long] and
      (__ \ "modified" \ "$date").read[Long]
    ) (QueryGet.apply _)
}
