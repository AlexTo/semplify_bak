package modules.webcrawler.actors

import akka.actor.{Actor, ActorRef, Props}
import akka.util.Timeout
import javax.inject.{Inject, Named}
import modules.task.models.{StopTask, TaskFinished, StartTask, TaskStarted}
import modules.webcrawler.models.WebCrawlParams
import modules.webcrawler.services.WebCrawlerService
import play.api.libs.json.JsObject

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}


class WebCrawler @Inject()(@Named("taskManager") taskManagerActor: ActorRef,
                           webCrawlerService: WebCrawlerService)
                          (implicit ec: ExecutionContext) extends Actor {

  implicit val timeout: Timeout = 5.seconds

  override def receive: Receive = {
    case task: StartTask => createTask(task)
    case task: StopTask => stopTask(task)
  }

  def createTask(task: StartTask): Future[Unit] = {
    val params = task.params.as[WebCrawlParams]
    taskManagerActor ! TaskStarted(task.id)
    webCrawlerService.crawl(task.id, task.projectId, params) map { _ =>
      taskManagerActor ! TaskFinished(task.id, None)
    }
  }

  def stopTask(task: StopTask): Unit = {
    webCrawlerService.stop(task.id)
  }

}

object WebCrawler {
  def props: Props = Props[WebCrawler]
}
