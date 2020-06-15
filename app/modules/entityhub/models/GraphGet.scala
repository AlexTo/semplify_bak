package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class GraphGet(projectId: String, value: String)

object GraphGet {
  implicit val format: OFormat[GraphGet] = Json.format[GraphGet]
}
