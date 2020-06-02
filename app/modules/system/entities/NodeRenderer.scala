package modules.system.entities

import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class ColorMap(key: String, color: String)

object ColorMap {
  implicit val handler: BSONDocumentHandler[ColorMap] = Macros.handler[ColorMap]
  implicit val format: OFormat[ColorMap] = Json.format[ColorMap]
}

case class NodeRenderer(colorMaps: Seq[ColorMap])

object NodeRenderer {
  implicit val handler: BSONDocumentHandler[NodeRenderer] = Macros.handler[NodeRenderer]
  implicit val format: OFormat[NodeRenderer] = Json.format[NodeRenderer]
}
