package modules.webcrawler.controllers

import javax.inject.{Inject, Singleton}
import modules.webcrawler.services.WebCrawlerService
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class WebPageController @Inject()(webCrawlerService: WebCrawlerService, cc: ControllerComponents)
                                 (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def findAll(projectId: String): Action[AnyContent] = Action.async { _ =>
    webCrawlerService.findAllCrawledPages(projectId) map {
      webPages => Ok(Json.toJson(webPages))
    }
  }

}
