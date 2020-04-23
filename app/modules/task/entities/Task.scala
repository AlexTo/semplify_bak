package modules.task.entities

import modules.task.entities.TaskStatus.TaskStatus
import play.api.libs.json.{JsObject, Json, OWrites, Reads}
import reactivemongo.bson.{BSONDateTime, BSONObjectID}
import reactivemongo.play.json._

case class Task(_id: BSONObjectID,
                `type`: String,
                projectId: String,
                status: TaskStatus,
                params: JsObject,
                created: BSONDateTime,
                modified: BSONDateTime)

object Task {
  implicit val reads: Reads[Task] = Json.reads[Task]
  implicit val writes: OWrites[Task] = Json.writes[Task]
}

