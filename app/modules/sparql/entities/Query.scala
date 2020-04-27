package modules.sparql.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.{BSONDateTime, BSONObjectID}
import reactivemongo.play.json._

case class Query(_id: BSONObjectID,
                 projectId: BSONObjectID,
                 label: String,
                 description: Option[String],
                 query: String,
                 createdBy: String,
                 modifiedBy: String,
                 created: BSONDateTime,
                 modified: BSONDateTime)

object Query {
  implicit val writes: OWrites[Query] = Json.writes[Query]
  implicit val reads: Reads[Query] = Json.reads[Query]
}


