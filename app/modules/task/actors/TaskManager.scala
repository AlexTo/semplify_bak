package modules.task.actors

import akka.actor.{Actor, ActorSystem, Props}
import akka.pattern.pipe
import akka.util.Timeout
import javax.inject.Inject
import modules.task.models._
import modules.task.services.TaskService

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

class TaskManager @Inject()(system: ActorSystem, taskService: TaskService)
                           (implicit ex: ExecutionContext) extends Actor {
  implicit val timeout: Timeout = 5.seconds

  override def receive: Receive = {
    case task: TaskCreate => create(task) pipeTo sender()

    case TaskStarted(id) =>
      taskService.setTaskStarted(id)

    case TaskFinished(id, error) =>
      taskService.setTaskFinished(id, error)

    case task: StopTask => stop(task) pipeTo sender()
  }

  def stop(stopTask: StopTask): Future[Int] = taskService.stop(stopTask.id, stopTask.`type`) map { n =>
    if (n > 0) {
      system.actorSelection(s"/user/${stopTask.`type`}").resolveOne() map {
        _ ! stopTask
      }
    }
    n
  }

  def create(task: TaskCreate): Future[TaskGet] = taskService.create(task) flatMap { task =>
    system.actorSelection(s"/user/${task.`type`}").resolveOne() map { taskExecutor =>
      taskExecutor ! StartTask(task.id, task.projectId, task.params)
      task
    }
  }
}

object TaskManager {
  def props: Props = Props[TaskManager]
}

