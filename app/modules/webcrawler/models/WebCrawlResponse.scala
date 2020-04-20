package modules.webcrawler.models

import play.api.libs.json.{Json, OWrites, Reads}

case class WebCrawlResponse(urls: Seq[String])

object WebCrawlResponse {
  implicit val reads: Reads[WebCrawlResponse] = Json.reads[WebCrawlResponse]
  implicit val writes: OWrites[WebCrawlResponse] = Json.writes[WebCrawlResponse]
}
