package modules.webcrawler.services.impl

import java.util.concurrent.ConcurrentLinkedQueue
import java.util.regex.Pattern

import edu.uci.ics.crawler4j.crawler.{CrawlConfig, CrawlController, Page, WebCrawler}
import edu.uci.ics.crawler4j.fetcher.PageFetcher
import edu.uci.ics.crawler4j.robotstxt.{RobotstxtConfig, RobotstxtServer}
import edu.uci.ics.crawler4j.url.WebURL
import javax.inject.Inject
import modules.webcrawler.models.{WebCrawlRequest, WebCrawlResponse}
import modules.webcrawler.services.WebCrawlerService
import play.api.Configuration

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._
import play.api.Logger

class WebCrawlerServiceImpl @Inject()(conf: Configuration)
                                     (implicit ec: ExecutionContext) extends WebCrawlerService {

  val logger: Logger = Logger(this.getClass)

  val FILE_ENDING_EXCLUSION_PATTERN: Pattern = Pattern.compile(".*(\\.(" +
    "css|js" +
    "|bmp|gif|jpe?g|JPE?G|png|tiff?|ico|nef|raw" +
    "|mid|mp2|mp3|mp4|wav|wma|flv|mpe?g" +
    "|avi|mov|mpeg|ram|m4v|wmv|rm|smil" +
    "|pdf|doc|docx|pub|xls|xlsx|vsd|ppt|pptx" +
    "|swf" +
    "|zip|rar|gz|bz2|7z|bin" +
    "|xml|txt|java|c|cpp|exe" +
    "))$");

  val crawlStorageFolder = s"${conf.get[String]("app.storageDir")}/crawler"

  class Crawler(callback: (Page) => Boolean) extends WebCrawler {

    override def shouldVisit(referringPage: Page, url: WebURL): Boolean = {
      val href = url.getURL.toLowerCase()
      val referringDomain = referringPage.getWebURL.getDomain
      val domain = url.getDomain
      !FILE_ENDING_EXCLUSION_PATTERN.matcher(href).matches() && domain.equalsIgnoreCase(referringDomain)
    }

    override def visit(page: Page): Unit = {
      super.visit(page)
      callback.apply(page)
      logger.info(s"Visiting: ${page.getWebURL}")
    }
  }

  override def crawl(webCrawlRequest: WebCrawlRequest): Future[WebCrawlResponse] = Future {
    val numberOfCrawlers = 4
    val config = new CrawlConfig
    config.setCrawlStorageFolder((crawlStorageFolder))
    config.setMaxDepthOfCrawling(webCrawlRequest.depth)
    val pageFetcher = new PageFetcher(config)
    val robotstxtConfig = new RobotstxtConfig;
    val robotstxtServer = new RobotstxtServer(robotstxtConfig, pageFetcher);
    val controller = new CrawlController(config, pageFetcher, robotstxtServer)
    val pages = new ConcurrentLinkedQueue[Page]
    controller.addSeed(webCrawlRequest.seedUrl)
    val factory: CrawlController.WebCrawlerFactory[Crawler] = () => new Crawler((page) => pages.add(page))
    controller.start(factory, numberOfCrawlers)
    WebCrawlResponse(pages.asScala.map(p => p.getWebURL.getURL).toSeq)
  }
}
