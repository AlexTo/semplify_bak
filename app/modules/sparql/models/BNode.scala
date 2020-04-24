package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class BNode(`type`: String = "bnode", value: String) extends Value

object BNode {
  implicit val reads: Reads[BNode] = Json.reads[BNode]
  implicit val writes: OWrites[BNode] = Json.writes[BNode]
}
