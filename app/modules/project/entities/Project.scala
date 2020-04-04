package modules.project.entities

import java.util.Date

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json.BSONObjectIDFormat

case class Project(_id: BSONObjectID,
                   title: String,
                   createdBy: String,
                   modifiedBy: String,
                   created: Date,
                   modified: Date)

object Project {
  implicit val writes: OWrites[Project] = Json.writes[Project]
  implicit val reads: Reads[Project] = Json.reads[Project]
}

