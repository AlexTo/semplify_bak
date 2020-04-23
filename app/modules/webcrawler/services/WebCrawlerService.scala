package modules.webcrawler.services

import com.google.inject.ImplementedBy
import modules.webcrawler.models.{PageGet, WebCrawlParams}
import modules.webcrawler.services.impl.WebCrawlerServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[WebCrawlerServiceImpl])
trait WebCrawlerService {
  def crawl(taskId: String, projectId: String, params: WebCrawlParams): Future[Unit]

  def stop(taskId: String): Unit

  def findAllCrawledPages(projectId: String): Future[Seq[PageGet]]
}
