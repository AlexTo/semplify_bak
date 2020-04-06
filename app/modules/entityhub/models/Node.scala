package modules.entityhub.models

import play.api.libs.json.{Json, Reads, Writes}

case class Node(projectId: String,
                graph: String,
                value: String,
                _type: String,
                lang: Option[String] = Option.empty,
                dataType: Option[String] = Option.empty)

object Node {
  implicit val reads: Reads[Node] = Json.reads[Node]
  implicit val writes: Writes[Node] = Json.writes[Node]
}
