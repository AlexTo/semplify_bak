package modules.webcrawler.models

import play.api.libs.json._

case class WebCrawlParams(seedUrl: String, depth: Int)

object WebCrawlParams {
  implicit val reads: Reads[WebCrawlParams] = Json.reads[WebCrawlParams]

  implicit val writes: OWrites[WebCrawlParams] = Json.writes[WebCrawlParams]
}
