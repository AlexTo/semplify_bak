package modules.project.entities

import modules.triplestore.models.RepositoryType
import modules.triplestore.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONDateTime

case class NativeRepository(override val `type`: RepositoryType = RepositoryType.Native,
                            override val created: BSONDateTime,
                            override val modified: BSONDateTime) extends Repository

object NativeRepository {
  implicit val reads: Reads[NativeRepository] = Json.reads[NativeRepository]
  implicit val writes: OWrites[NativeRepository] = Json.writes[NativeRepository]
}
