package modules.system.entities

import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class VisualGraph(nodeRenderer: NodeRenderer,
                       edgeRenderer: EdgeRenderer)

object VisualGraph {
  implicit val handler: BSONDocumentHandler[VisualGraph] = Macros.handler[VisualGraph]
  implicit val format: OFormat[VisualGraph] = Json.format[VisualGraph]
}
