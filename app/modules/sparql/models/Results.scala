package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Results(bindings: Seq[Map[String, Value]])

object Results {
  implicit val reads: Reads[Results] = Json.reads[Results]
  implicit val writes: OWrites[Results] = Json.writes[Results]
}
