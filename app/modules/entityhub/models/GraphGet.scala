package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class GraphGet(projectId: String, value: String)

object GraphGet {
  implicit val reads: Reads[GraphGet] = Json.reads[GraphGet]
  implicit val writes: OWrites[GraphGet] = Json.writes[GraphGet]
}
