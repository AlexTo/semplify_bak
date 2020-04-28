package modules.task.services.impl

import javax.inject.Inject
import modules.project.services.ProjectService
import modules.task.entities.{Task, TaskStatus}
import modules.task.models.{TaskCreate, TaskGet}
import modules.task.services.TaskService
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.Cursor
import reactivemongo.bson.{BSONDateTime, BSONDocument, BSONObjectID}
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

class TaskServiceImpl @Inject()(projectService: ProjectService,
                                reactiveMongoApi: ReactiveMongoApi)
                               (implicit val ec: ExecutionContext) extends TaskService {

  def collection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("tasks"))

  def create(task: TaskCreate): Future[TaskGet] = projectService.findById(task.projectId) flatMap {
    case Some(_) =>
      val taskId = BSONObjectID.generate()
      val created = BSONDateTime(System.currentTimeMillis())
      val entity = Task(taskId, task.`type`, BSONObjectID.parse(task.projectId).get,
        TaskStatus.Queued, task.params,
        created, created)
      collection
        .flatMap(_.insert.one(entity))
        .map(_ => TaskGet(entity._id.stringify, entity.`type`, entity.projectId.stringify, entity.params,
          entity.status.toString, created.value, created.value))
  }

  def setTaskStarted(taskId: String): Future[Int] = BSONObjectID.parse(taskId) match {
    case Success(id) =>
      collection.flatMap { coll =>
        val q = BSONDocument("_id" -> id, "status" -> TaskStatus.Queued.toString)
        val u = BSONDocument("$set" -> BSONDocument(
          "status" -> TaskStatus.Started.toString,
          "modified" -> BSONDateTime(System.currentTimeMillis()),
        ))
        coll.update.one(q, u, upsert = false, multi = false).map {
          _.n
        }
      }
  }

  override def setTaskFinished(taskId: String): Future[Int] = BSONObjectID.parse(taskId) match {
    case Success(id) =>
      collection flatMap { coll =>
        val updateBuilder = coll.update(true)
        val updates = Future.sequence(
          updateBuilder.element(
            q = BSONDocument("_id" -> id, "status" -> TaskStatus.Started.toString),
            u = BSONDocument("$set" -> BSONDocument(
              "status" -> TaskStatus.Finished.toString,
              "modified" -> BSONDateTime(System.currentTimeMillis()),
            )),
            upsert = false, multi = false
          ) :: updateBuilder.element(
            q = BSONDocument("_id" -> id, "status" -> TaskStatus.Stopping.toString),
            u = BSONDocument("$set" -> BSONDocument(
              "status" -> TaskStatus.Stopped.toString,
              "modified" -> BSONDateTime(System.currentTimeMillis()),
            )),
            upsert = false, multi = false
          ) :: Nil
        )
        updates flatMap { ops => updateBuilder.many(ops) }
      } map {
        _.n
      }
  }

  override def stop(taskId: String, `type`: String): Future[Int] = BSONObjectID.parse(taskId) match {
    case Success(id) =>
      collection flatMap { coll =>
        val q = BSONDocument("_id" -> id,
          "type" -> `type`,
          "status" -> TaskStatus.Started.toString)
        val u = BSONDocument("$set" -> BSONDocument(
          "status" -> TaskStatus.Stopping.toString,
          "modified" -> BSONDateTime(System.currentTimeMillis()),
        ))
        coll.update.one(q, u, upsert = false, multi = false) map {
          _.n
        }
      }
  }

  override def findAll: Future[Seq[TaskGet]] = collection map {
    _.find(Json.obj(), Option.empty[JsObject]).cursor[TaskGet]()
  } flatMap {
    _.collect[Seq](-1, Cursor.FailOnError[Seq[TaskGet]]())
  }
}
