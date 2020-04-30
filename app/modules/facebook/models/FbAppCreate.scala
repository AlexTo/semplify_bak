package modules.facebook.models

import play.api.libs.json.{Json, OWrites, Reads}

case class FbAppCreate(appId: String, appSecret: String)

object FbAppCreate {
  implicit val reads: Reads[FbAppCreate] = Json.reads[FbAppCreate]
  implicit val writes: OWrites[FbAppCreate] = Json.writes[FbAppCreate]
}
