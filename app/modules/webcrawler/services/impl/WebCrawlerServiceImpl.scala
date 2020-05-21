package modules.webcrawler.services.impl

import java.util.concurrent.{ConcurrentHashMap, ConcurrentLinkedQueue}
import java.util.regex.Pattern

import edu.uci.ics.crawler4j.crawler.{CrawlConfig, CrawlController, Page, WebCrawler}
import edu.uci.ics.crawler4j.fetcher.PageFetcher
import edu.uci.ics.crawler4j.parser.HtmlParseData
import edu.uci.ics.crawler4j.robotstxt.{RobotstxtConfig, RobotstxtServer}
import edu.uci.ics.crawler4j.url.WebURL
import javax.inject.Inject
import modules.project.services.ProjectService
import modules.webcrawler.models.{PageGet, WebCrawlParams}
import modules.webcrawler.services.WebCrawlerService
import play.api.Configuration
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.Cursor
import reactivemongo.bson.{BSONDocument, BSONObjectID}
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._

class WebCrawlerServiceImpl @Inject()(conf: Configuration, projectService: ProjectService,
                                      reactiveMongoApi: ReactiveMongoApi)
                                     (implicit ec: ExecutionContext) extends WebCrawlerService {

  def collection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("pages.crawled"))

  val runningTasks = new ConcurrentHashMap[String, CrawlController]()

  val FILE_ENDING_EXCLUSION_PATTERN: Pattern = Pattern.compile(".*(\\.(" +
    "css|js" +
    "|bmp|gif|jpe?g|JPE?G|png|tiff?|ico|nef|raw" +
    "|mid|mp2|mp3|mp4|wav|wma|flv|mpe?g" +
    "|avi|mov|mpeg|ram|m4v|wmv|rm|smil" +
    "|pub|swf" +
    "|zip|rar|gz|bz2|7z|bin" +
    "|xml|txt|java|c|cpp|exe" +
    "))$")

  val crawlStorageFolder = s"${conf.get[String]("app.tmpDir")}/crawler"

  class Crawler(callback: Page => Unit) extends WebCrawler {

    override def shouldVisit(referringPage: Page, url: WebURL): Boolean = {
      val href = url.getURL.toLowerCase()
      val referringDomain = referringPage.getWebURL.getDomain
      val domain = url.getDomain
      !FILE_ENDING_EXCLUSION_PATTERN.matcher(href).matches() && domain.equalsIgnoreCase(referringDomain)
    }

    override def visit(page: Page): Unit = {
      super.visit(page)
      callback.apply(page)
    }
  }

  override def crawl(taskId: String, projectId: String, params: WebCrawlParams): Future[Unit] = projectService.findById(projectId) map {
    case Some(project) =>
      val numberOfCrawlers = 7
      val config = new CrawlConfig
      config.setCrawlStorageFolder(crawlStorageFolder)
      config.setMaxDepthOfCrawling(params.depth)
      val pageFetcher = new PageFetcher(config)
      val robotstxtConfig = new RobotstxtConfig
      val robotstxtServer = new RobotstxtServer(robotstxtConfig, pageFetcher)

      val controller = new CrawlController(config, pageFetcher, robotstxtServer)
      val pages = new ConcurrentLinkedQueue[Page]
      controller.addSeed(params.seedUrl)

      val factory: CrawlController.WebCrawlerFactory[Crawler] = () => new Crawler(page => pages.add(page))

      runningTasks.put(taskId, controller)

      controller.start(factory, numberOfCrawlers)

      runningTasks.remove(taskId)

      insertPages(project.id, pages)
  }

  override def stop(taskId: String): Unit = {
    if (runningTasks.containsKey(taskId)) {
      runningTasks.get(taskId).shutdown()
    }
  }

  override def findAllCrawledPages(projectId: String): Future[Seq[PageGet]] = collection map {
    _.find(Json.obj(), Option.empty[JsObject]).cursor[PageGet]()
  } flatMap {
    _.collect[Seq](-1, Cursor.FailOnError[Seq[PageGet]]())
  }

  def insertPages(projectId: String, pages: ConcurrentLinkedQueue[Page]): Any = {
    if (pages.size() == 0) {
      return
    }
    collection.flatMap { crawledPagesCollection =>
      val updateBuilder = crawledPagesCollection.update(true)
      val updates = Future.sequence(pages.asScala.map(p => updateBuilder.element(
        q = BSONDocument("projectId" -> projectId,
          "url" -> p.getWebURL.getURL),
        u = BSONDocument("$set" -> BSONDocument(
          "projectId" -> BSONObjectID.parse(projectId).get,
          "url" -> p.getWebURL.getURL,
          "domain" -> p.getWebURL.getDomain,
          "content" -> (p.getParseData match {
            case data: HtmlParseData => data.getText
            case _ => new String(p.getContentData)
          }),
          "title" -> (p.getParseData match {
            case data: HtmlParseData => Some(data.getTitle)
            case _ => None
          }),
          "contentType" -> Option(p.getContentType),
          "charset" -> Option(p.getContentCharset),
          "encoding" -> Option(p.getContentEncoding)
        )),
        upsert = true,
        multi = false
      )).toSeq)
      updates.flatMap { ops => updateBuilder.many(ops) }
    }
  }
}
