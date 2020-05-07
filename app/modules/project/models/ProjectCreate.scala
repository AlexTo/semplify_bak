package modules.project.models

import modules.triplestore.models.RepositoryCreate
import play.api.libs.json.{Json, OWrites, Reads}

case class ProjectCreate(title: String,
                         repository: RepositoryCreate)

object ProjectCreate {
  implicit val writes: OWrites[ProjectCreate] = Json.writes[ProjectCreate]
  implicit val reads: Reads[ProjectCreate] = Json.reads[ProjectCreate]
}