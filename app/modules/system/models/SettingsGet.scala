package modules.system.models

import modules.system.entities.SettingsScope.SettingScope
import modules.system.entities.VisualGraph
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsObject, Json, OWrites, Reads, __}

case class SettingsGet(id: String,
                       projectId: String,
                       username: Option[String],
                       scope: SettingScope,
                       visualGraph: VisualGraph,
                       created: Long,
                       modified: Long)

object SettingsGet {
  implicit val writes: OWrites[SettingsGet] = Json.writes[SettingsGet]
  implicit val reads: Reads[SettingsGet] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "projectId" \ "$oid").read[String] and
      (__ \ "user").readNullable[String] and
      (__ \ "scope").read[SettingScope] and
      (__ \ "visualGraph").read[VisualGraph] and
      (__ \ "created" \ "$date").read[Long] and
      (__ \ "modified" \ "$date").read[Long]
    ) (SettingsGet.apply _)
}
