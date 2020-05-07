package modules.entityhub.models

import play.api.libs.json.{Reads, Writes}
import utils.EnumUtils

object QueryType extends Enumeration {
  type QueryType = Value
  val SearchNodes = Value
  implicit val reads: Reads[QueryType.Value] = EnumUtils.enumReads(QueryType)

  implicit def writes: Writes[QueryType] = EnumUtils.enumWrites
}
