package modules.triplestore.models

import play.api.libs.json.{Json, OWrites, Reads}

case class VirtuosoRepositoryGet(override val id: String,
                                 hostList: String) extends RepositoryGet

object VirtuosoRepositoryGet {
  implicit val reads: Reads[VirtuosoRepositoryGet] = Json.reads[VirtuosoRepositoryGet]
  implicit val writes: OWrites[VirtuosoRepositoryGet] = Json.writes[VirtuosoRepositoryGet]
}
