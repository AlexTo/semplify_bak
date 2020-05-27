package modules.system.models

import modules.system.entities.VisualGraph
import play.api.libs.json.{Json, OWrites, Reads}

case class SettingsCreate(projectId: String,
                          username: Option[String],
                          visualGraph: VisualGraph)

object SettingsCreate {
  implicit val reads: Reads[SettingsCreate] = Json.reads[SettingsCreate]
  implicit val writes: OWrites[SettingsCreate] = Json.writes[SettingsCreate]
}
