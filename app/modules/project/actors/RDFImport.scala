package modules.project.actors

import akka.actor.{Actor, ActorRef, Props}
import javax.inject.{Inject, Named}
import modules.task.models.{StartTask, StopTask, TaskFinished, TaskStarted}
import modules.triplestore.models.RDFImportParams
import modules.triplestore.services.RepositoryService

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

class RDFImport @Inject()(@Named("taskManager") taskManagerActor: ActorRef,
                          repositoryService: RepositoryService)
                         (implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case task: StartTask => createTask(task)
    case task: StopTask =>
  }

  def createTask(task: StartTask): Unit = {
    val params = task.params.as[RDFImportParams]
    taskManagerActor ! TaskStarted(task.id)
    repositoryService.importRDF(task.projectId, params.fileId, params.baseURI, params.graph, params.replaceGraph) map {
      case Success(_) => taskManagerActor ! TaskFinished(task.id, None)
      case Failure(exception) => taskManagerActor ! TaskFinished(task.id, Some(exception.getMessage))
    }
  }
}

object RDFImport {
  def props: Props = Props[RDFImport]
}