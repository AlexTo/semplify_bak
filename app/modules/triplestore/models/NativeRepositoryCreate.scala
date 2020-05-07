package modules.triplestore.models

import modules.triplestore.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}

case class NativeRepositoryCreate(override val `type`: RepositoryType = RepositoryType.Native)
  extends RepositoryCreate

object NativeRepositoryCreate {
  implicit val reads: Reads[NativeRepositoryCreate] = Json.reads[NativeRepositoryCreate]
  implicit val writes: OWrites[NativeRepositoryCreate] = Json.writes[NativeRepositoryCreate]
}
