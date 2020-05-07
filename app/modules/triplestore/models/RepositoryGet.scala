package modules.triplestore.models

import play.api.libs.json.{Reads, _}
import modules.triplestore.models.RepositoryType.RepositoryType

trait RepositoryGet {
  val id: String
  val `type`: RepositoryType
}

object RepositoryGet {
  implicit val reads =
    __.read[NativeRepositoryGet].map(x => x: RepositoryGet) orElse
      __.read[VirtuosoRepositoryGet].map(x => x: RepositoryGet)

  implicit val writes = {
    case native: NativeRepositoryGet => NativeRepositoryGet.writes.writes(native)
    case virtuoso: VirtuosoRepositoryGet => VirtuosoRepositoryGet.writes.writes(virtuoso)
  }


}
