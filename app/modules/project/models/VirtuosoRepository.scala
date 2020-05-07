package modules.project.models

import modules.project.models.RepositoryType.RepositoryType
import play.api.libs.json.{Json, OWrites, Reads}

case class VirtuosoRepository(override val `type`: RepositoryType = RepositoryType.Virtuoso,
                              hostList: String,
                              username: String,
                              password: String,
                              defGraph: String) extends Repository

object VirtuosoRepository {
  implicit val reads: Reads[VirtuosoRepository] = Json.reads[VirtuosoRepository]
  implicit val writes: OWrites[VirtuosoRepository] = Json.writes[VirtuosoRepository]
}
