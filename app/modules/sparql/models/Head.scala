package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Head(vars: Seq[String])

object Head {
  implicit val reads: Reads[Head] = Json.reads[Head]
  implicit val writes: OWrites[Head] = Json.writes[Head]
}
