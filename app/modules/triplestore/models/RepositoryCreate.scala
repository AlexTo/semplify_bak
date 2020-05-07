package modules.triplestore.models

import play.api.libs.json.{Reads, _}
import RepositoryType.RepositoryType

trait RepositoryCreate {
  val `type`: RepositoryType
}

object RepositoryCreate {
  implicit val reads: Reads[RepositoryCreate] = {
    __.read[NativeRepositoryCreate].map(x => x: RepositoryCreate) orElse
      __.read[VirtuosoRepositoryCreate].map(x => x: RepositoryCreate)
  }

  implicit val writes: Writes[RepositoryCreate] = Writes[RepositoryCreate] {
    case nativeRepositoryCreate: NativeRepositoryCreate => NativeRepositoryCreate.writes.writes(nativeRepositoryCreate)
    case virtuosoRepositoryCreate: VirtuosoRepositoryCreate => VirtuosoRepositoryCreate.writes.writes(virtuosoRepositoryCreate)
  }
}
