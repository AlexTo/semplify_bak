package modules.system.entities

import play.api.libs.json.{Json, OWrites, Reads}

case class ColorMap(key: String, color: String)

object ColorMap {
  implicit val reads: Reads[ColorMap] = Json.reads[ColorMap]
  implicit val writes: OWrites[ColorMap] = Json.writes[ColorMap]
}

case class NodeRenderer(colorMaps: Seq[ColorMap])

object NodeRenderer {
  implicit val reads: Reads[NodeRenderer] = Json.reads[NodeRenderer]
  implicit val writes: OWrites[NodeRenderer] = Json.writes[NodeRenderer]
}
