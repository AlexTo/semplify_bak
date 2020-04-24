package modules.sparql.models

import play.api.libs.json.{Json, OWrites, Reads}

case class QueryResult(head: Head, results: Results)

object QueryResult {
  implicit val reads: Reads[QueryResult] = Json.reads[QueryResult]
  implicit val writes: OWrites[QueryResult] = Json.writes[QueryResult]
}
