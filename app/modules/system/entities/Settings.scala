package modules.system.entities

import modules.system.entities.SettingsScope.SettingScope
import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.{BSONDateTime, BSONObjectID}
import reactivemongo.play.json._

case class Settings(_id: BSONObjectID,
                    projectId: BSONObjectID,
                    username: Option[String],
                    scope: SettingScope,
                    visualGraph: VisualGraph,
                    created: BSONDateTime,
                    modified: BSONDateTime)

object Settings {
  implicit val reads: Reads[Settings] = Json.reads[Settings]
  implicit val writes: OWrites[Settings] = Json.writes[Settings]
}
