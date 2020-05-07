package modules.triplestore.models

import play.api.libs.json.{Json, OWrites, Reads}

case class VirtuosoRepositoryCreate(hostList: String) extends RepositoryCreate

object VirtuosoRepositoryCreate {
  implicit val reads: Reads[VirtuosoRepositoryCreate] = Json.reads[VirtuosoRepositoryCreate]
  implicit val writes: OWrites[VirtuosoRepositoryCreate] = Json.writes[VirtuosoRepositoryCreate]
}
