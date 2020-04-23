package modules.webcrawler.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json._

case class Page(_id: BSONObjectID,
                projectId: BSONObjectID,
                url: String,
                title: Option[String],
                content: String,
                contentType: Option[String],
                domain: String)

object Page {
  implicit val reads: Reads[Page] = Json.reads[Page]
  implicit val writes: OWrites[Page] = Json.writes[Page]
}
