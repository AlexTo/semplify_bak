package modules.system.entities

import play.api.libs.json.{Reads, Writes}
import utils.EnumUtils

object SettingsScope extends Enumeration {
  type SettingScope = Value
  val Project, User = Value
  implicit val reads: Reads[SettingsScope.Value] = EnumUtils.enumReads(SettingsScope)

  implicit def writes: Writes[SettingScope] = EnumUtils.enumWrites
}
