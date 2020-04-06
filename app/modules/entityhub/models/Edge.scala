package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Edge(projectId: String,
                graph: String,
                value: String,
                from: Node,
                to: Node)

object Edge {
  implicit val reads: Reads[Edge] = Json.reads[Edge]
  implicit val writes: OWrites[Edge] = Json.writes[Edge]
}

