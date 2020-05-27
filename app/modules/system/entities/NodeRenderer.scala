package modules.system.entities

import play.api.libs.json.{Json, OWrites, Reads}

case class NodeRenderer(colorMap: Map[String, String])

object NodeRenderer {
  implicit val reads: Reads[NodeRenderer] = Json.reads[NodeRenderer]
  implicit val writes: OWrites[NodeRenderer] = Json.writes[NodeRenderer]
}
