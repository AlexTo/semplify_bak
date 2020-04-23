package modules.task.models

import play.api.libs.json.{JsObject, Json, OWrites, Reads}

case class TaskCreate(`type`: String, projectId: String, params: JsObject)

object TaskCreate {
  implicit val reads: Reads[TaskCreate] = Json.reads[TaskCreate]
  implicit val writes: OWrites[TaskCreate] = Json.writes[TaskCreate]
}
