package modules.task.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsObject, Json, OWrites, Reads, __}

case class TaskGet(id: String,
                   `type`: String,
                   projectId: String,
                   params: JsObject,
                   status: String,
                   created: Long,
                   modified: Long)

object TaskGet {
  implicit val writes: OWrites[TaskGet] = Json.writes[TaskGet]
  implicit val reads: Reads[TaskGet] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "type").read[String] and
      (__ \ "projectId").read[String] and
      (__ \ "params").read[JsObject] and
      (__ \ "status").read[String] and
      (__ \ "created" \ "$date").read[Long] and
      (__ \ "modified" \ "$date").read[Long]
    ) (TaskGet.apply _)
}
