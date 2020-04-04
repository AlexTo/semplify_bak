package modules.project.services.impl

import java.util.Calendar

import javax.inject.Inject
import modules.project.entities.Project
import modules.project.models.{ProjectCreate, ProjectGet}
import modules.project.services.ProjectService
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.bson.BSONObjectID
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}

class ProjectServiceImpl @Inject()(val reactiveMongoApi: ReactiveMongoApi,
                                  )(implicit ex: ExecutionContext) extends ProjectService {

  def collection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("projects"))

  override def save(project: ProjectCreate, username: String): Future[ProjectGet] = {
    val entity = Project(_id = BSONObjectID.generate(),
      project.title,
      username, username,
      Calendar.getInstance().getTime,
      Calendar.getInstance().getTime)
    collection
      .flatMap(_.insert.one(entity))
      .map(_ => ProjectGet(entity._id.stringify, entity.title))
  }
}
