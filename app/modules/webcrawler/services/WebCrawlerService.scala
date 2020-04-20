package modules.webcrawler.services

import com.google.inject.ImplementedBy
import modules.webcrawler.models.{WebCrawlRequest, WebCrawlResponse}
import modules.webcrawler.services.impl.WebCrawlerServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[WebCrawlerServiceImpl])
trait WebCrawlerService {
  def crawl(webCrawlRequest: WebCrawlRequest): Future[WebCrawlResponse]
}
