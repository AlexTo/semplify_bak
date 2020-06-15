package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class SearchHit(node: IRI, score: Double, snippet: String)

object SearchHit {
  implicit val format: OFormat[SearchHit] = Json.format[SearchHit]
}
