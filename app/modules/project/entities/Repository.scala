package modules.project.entities

import modules.triplestore.models.RepositoryType.RepositoryType
import play.api.libs.json._
import reactivemongo.bson.BSONDateTime

trait Repository {
  val `type`: RepositoryType
  val created: BSONDateTime
  val modified: BSONDateTime
}

object Repository {
  implicit val reads: Reads[Repository] =
    __.read[NativeRepository].map(x => x: Repository) orElse
      __.read[VirtuosoRepository].map(x => x: Repository)

  implicit val writes: Writes[Repository] = Writes[Repository] {
    case native: NativeRepository => NativeRepository.writes.writes(native)
    case virtuoso: VirtuosoRepository => VirtuosoRepository.writes.writes(virtuoso)
  }
}
