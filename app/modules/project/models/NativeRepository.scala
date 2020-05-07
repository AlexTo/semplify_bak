package modules.project.models

import modules.project.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}

case class NativeRepository(override val `type`: RepositoryType = RepositoryType.Native
                           ) extends Repository

object NativeRepository {
  implicit val reads: Reads[NativeRepository] = Json.reads[NativeRepository]
  implicit val writes: OWrites[NativeRepository] = Json.writes[NativeRepository]
}
