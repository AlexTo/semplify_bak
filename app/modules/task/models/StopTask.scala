package modules.task.models

import play.api.libs.json.{Json, OWrites, Reads}

case class StopTask(id: String, `type`: String)

object StopTask {
  implicit val reads: Reads[StopTask] = Json.reads[StopTask]
  implicit val writes: OWrites[StopTask] = Json.writes[StopTask]
}
