package modules.triplestore.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json._

case class Repository(_id: BSONObjectID,

                     )

object Repository {
  implicit val reads: Reads[Repository] = Json.reads[Repository]
  implicit val writes: OWrites[Repository] = Json.writes[Repository]
}
