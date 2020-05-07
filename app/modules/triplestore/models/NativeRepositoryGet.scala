package modules.triplestore.models

import modules.triplestore.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}

case class NativeRepositoryGet(override val id: String,
                               override val `type`: RepositoryType = RepositoryType.Native) extends RepositoryGet

object NativeRepositoryGet {
  implicit val reads: Reads[NativeRepositoryGet] = Json.reads[NativeRepositoryGet]
  implicit val writes: OWrites[NativeRepositoryGet] = Json.writes[NativeRepositoryGet]
}
