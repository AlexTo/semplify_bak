package modules.system.entities

import play.api.libs.json.{Reads, Writes}
import utils.EnumUtils

object EdgeFilterMode extends Enumeration {
  type EdgeFilterMode = Value
  val Inclusive, Exclusive = Value
  implicit val reads: Reads[EdgeFilterMode.Value] = EnumUtils.enumReads(EdgeFilterMode)

  implicit def writes: Writes[EdgeFilterMode] = EnumUtils.enumWrites
}
