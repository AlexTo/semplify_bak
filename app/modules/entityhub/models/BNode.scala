package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class BNode(override val projectId: String,
                 override val graph: Option[String],
                 override val value: String) extends Value

object BNode {
  implicit val format: OFormat[BNode] = Json.format[BNode]
}
