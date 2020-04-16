package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class BNode(projectId: String,
                 graph: Option[String],
                 value: String) extends Value

object BNode {
  implicit val reads: Reads[BNode] = Json.reads[BNode]
  implicit val writes: OWrites[BNode] = Json.writes[BNode]
}
