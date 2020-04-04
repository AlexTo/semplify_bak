package modules.project.models

import play.api.libs.json.{Json, OWrites, Reads}

case class ProjectCreate(title: String)

object ProjectCreate {
  implicit val writes: OWrites[ProjectCreate] = Json.writes[ProjectCreate]
  implicit val reads: Reads[ProjectCreate] = Json.reads[ProjectCreate]
}