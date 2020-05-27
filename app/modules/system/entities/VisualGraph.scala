package modules.system.entities

import play.api.libs.json.{Json, OWrites, Reads}

case class VisualGraph(nodeRenderer: NodeRenderer,
                       edgeRenderer: EdgeRenderer)

object VisualGraph {
  implicit val reads: Reads[VisualGraph] = Json.reads[VisualGraph]
  implicit val writes: OWrites[VisualGraph] = Json.writes[VisualGraph]
}
