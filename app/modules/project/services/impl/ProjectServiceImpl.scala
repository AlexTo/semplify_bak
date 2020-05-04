package modules.project.services.impl

import java.util.Calendar

import javax.inject.Inject
import modules.project.entities.Project
import modules.project.models.{ProjectCreate, ProjectGet}
import modules.project.services.ProjectService
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.Cursor
import reactivemongo.bson._
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class ProjectServiceImpl @Inject()(reactiveMongoApi: ReactiveMongoApi)
                                  (implicit ex: ExecutionContext) extends ProjectService {

  def projectCollection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("projects"))

  override def create(project: ProjectCreate, username: String): Future[ProjectGet] = {
    val created = System.currentTimeMillis()
    val entity = Project(BSONObjectID.generate(),
      project.title, username, username,
      created, created)
    projectCollection
      .flatMap(_.insert.one(entity))
      .map(_ => ProjectGet(entity._id.stringify, entity.title))
  }

  override def findAll: Future[Seq[ProjectGet]] = projectCollection map {
    _.find(Json.obj(), Option.empty[JsObject]).cursor[ProjectGet]()
  } flatMap {
    _.collect[Seq](-1, Cursor.FailOnError[Seq[ProjectGet]]())
  }

  override def findById(projectId: String): Future[Option[ProjectGet]] = BSONObjectID.parse(projectId) match {
    case Success(id) => projectCollection.flatMap {
      val query = BSONDocument("_id" -> id)
      _.find(query, Option.empty[JsObject])
        .one[ProjectGet]
    }
    case Failure(_) => Future.successful(None)
  }
}
