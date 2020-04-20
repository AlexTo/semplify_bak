package modules.webcrawler.controllers

import javax.inject.{Inject, Singleton}
import modules.webcrawler.models.WebCrawlRequest
import modules.webcrawler.services.WebCrawlerService
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{AbstractController, Action, ControllerComponents, Request}

import scala.concurrent.ExecutionContext

@Singleton
class WebCrawlerController @Inject()(webCrawlerService: WebCrawlerService, cc: ControllerComponents)
                                    (implicit ec: ExecutionContext) extends AbstractController(cc) {
  def crawl: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val json = request.body
    val webCrawlRequest = json.as[WebCrawlRequest]
    webCrawlerService.crawl(webCrawlRequest)
      .map(response => Ok(Json.toJson(response)))
  }
}
