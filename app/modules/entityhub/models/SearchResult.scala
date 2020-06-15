package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class SearchResult(searchHits: Seq[SearchHit], limit: Int, offset: Int, total: Int)

object SearchResult {
  implicit val format: OFormat[SearchResult] = Json.format[SearchResult]
}
