package modules.project.models

import play.api.libs.json.{Json, OWrites, Reads}

case class ProjectGet(_id: String,
                      title: String)

object ProjectGet {
  implicit val writes: OWrites[ProjectGet] = Json.writes[ProjectGet]
  implicit val reads: Reads[ProjectGet] = Json.reads[ProjectGet]
}
