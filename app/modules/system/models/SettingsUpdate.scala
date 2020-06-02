package modules.system.models

import modules.system.entities.VisualGraph
import play.api.libs.json.{Json, OFormat}

case class SettingsUpdate(visualGraph: VisualGraph)

object SettingsUpdate {
  implicit val format: OFormat[SettingsUpdate] = Json.format[SettingsUpdate]
}
