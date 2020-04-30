package modules.facebook.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, OWrites, Reads, __}

case class FbAppGet(id: String, appId: String, appSecret: String)

object FbAppGet {
  implicit val writes = Json.writes[FbAppGet]
  implicit val reads = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "appId").read[String] and
      (__ \ "appSecret").read[String]
    ) (FbAppGet.apply _)
}
