package modules.task.models

import play.api.libs.json.{JsObject, Json, OWrites, Reads}

case class StartTask(id: String, projectId: String, params: JsObject)

object StartTask {
  implicit val reads: Reads[StartTask] = Json.reads[StartTask]
  implicit val writes: OWrites[StartTask] = Json.writes[StartTask]
}
