package modules.project.entities

import modules.triplestore.models.RepositoryType
import modules.triplestore.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}
import reactivemongo.bson.BSONDateTime

case class VirtuosoRepository(override val `type`: RepositoryType = RepositoryType.Native,
                              override val created: BSONDateTime,
                              override val modified: BSONDateTime,
                              hostList: String) extends Repository

object VirtuosoRepository {
  implicit val reads: Reads[VirtuosoRepository] = Json.reads[VirtuosoRepository]
  implicit val writes: OWrites[VirtuosoRepository] = Json.writes[VirtuosoRepository]
}
