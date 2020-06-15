package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class TriplePage(triples: Seq[Triple], limit: Int, offset: Int, total: Int)

object TriplePage {
  implicit val format: OFormat[TriplePage] = Json.format[TriplePage]
}
