package modules.task.services

import com.google.inject.ImplementedBy
import modules.task.models.{TaskCreate, TaskGet}
import modules.task.services.impl.TaskServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[TaskServiceImpl])
trait TaskService {

  def findAll: Future[Seq[TaskGet]]

  def create(taskCreate: TaskCreate): Future[TaskGet]

  def setTaskStarted(taskId: String): Future[Int]

  def setTaskFinished(taskId: String): Future[Int]

  def stop(taskId: String, `type`: String): Future[Int]

}
