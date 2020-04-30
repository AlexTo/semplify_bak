package modules.project.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json._

case class Project(_id: BSONObjectID,
                   title: String,
                   createdBy: String,
                   modifiedBy: String,
                   created: Long,
                   modified: Long)

object Project {
  implicit val writes: OWrites[Project] = Json.writes[Project]
  implicit val reads: Reads[Project] = Json.reads[Project]
}

