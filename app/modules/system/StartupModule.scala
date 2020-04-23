package modules.system

import com.google.inject.AbstractModule
import modules.task.actors.TaskManager
import modules.webcrawler.actors.WebCrawler
import play.api.libs.concurrent.AkkaGuiceSupport

class StartupModule extends AbstractModule with AkkaGuiceSupport {
  override def configure(): Unit = {
    bindActor[TaskManager]("taskManager")
    bindActor[WebCrawler]("webCrawler")
  }
}