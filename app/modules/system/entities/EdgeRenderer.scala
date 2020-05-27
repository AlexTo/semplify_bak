package modules.system.entities

import modules.system.entities.EdgeFilterMode.EdgeFilterMode
import play.api.libs.json.{Json, OWrites, Reads}

case class EdgeRenderer(includePreds: Seq[String],
                        excludePreds: Seq[String],
                        filterMode: EdgeFilterMode)

object EdgeRenderer {
  implicit val reads: Reads[EdgeRenderer] = Json.reads[EdgeRenderer]
  implicit val writes: OWrites[EdgeRenderer] = Json.writes[EdgeRenderer]
}
