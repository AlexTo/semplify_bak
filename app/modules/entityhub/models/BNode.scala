package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class BNode(override val projectId: String,
                 override val graph: Option[String],
                 override val value: String) extends Value

object BNode {
  implicit val reads: Reads[BNode] = Json.reads[BNode]
  implicit val writes: OWrites[BNode] = Json.writes[BNode]
}
