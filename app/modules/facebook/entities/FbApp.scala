package modules.facebook.entities

import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json._

case class FbApp(_id: BSONObjectID,
                 appId: String,
                 appSecret: String)

object FbApp {
  implicit val reads: Reads[FbApp] = Json.reads[FbApp]
  implicit val writes: OWrites[FbApp] = Json.writes[FbApp]
}
