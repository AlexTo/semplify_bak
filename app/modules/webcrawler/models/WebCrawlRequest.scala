package modules.webcrawler.models

import play.api.libs.json.{Json, OWrites, Reads}

case class WebCrawlRequest(seedUrl: String, depth: Int)

object WebCrawlRequest {
  implicit val reads: Reads[WebCrawlRequest] = Json.reads[WebCrawlRequest]
  implicit val writes: OWrites[WebCrawlRequest] = Json.writes[WebCrawlRequest]
}
