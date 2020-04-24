package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class IRI(`type`: String = "iri", value: String) extends Value

object IRI {
  implicit val reads: Reads[IRI] = Json.reads[IRI]
  implicit val writes: OWrites[IRI] = Json.writes[IRI]
}
