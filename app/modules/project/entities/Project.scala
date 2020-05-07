package modules.project.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.{BSONDateTime, BSONObjectID}
import reactivemongo.play.json._

case class Project(_id: BSONObjectID,
                   repository: Repository,
                   title: String,
                   createdBy: String,
                   modifiedBy: String,
                   created: BSONDateTime,
                   modified: BSONDateTime)

object Project {
  implicit val writes: OWrites[Project] = Json.writes[Project]
  implicit val reads: Reads[Project] = Json.reads[Project]
}

