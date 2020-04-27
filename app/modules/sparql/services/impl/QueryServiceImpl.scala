package modules.sparql.services.impl

import javax.inject.Inject
import modules.project.services.ProjectService
import modules.sparql.entities.Query
import modules.sparql.models.{QueryCreate, QueryGet}
import modules.sparql.services.QueryService
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.bson.{BSONDateTime, BSONObjectID}
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}

class QueryServiceImpl @Inject()(reactiveMongoApi: ReactiveMongoApi,
                                 projectService: ProjectService)
                                (implicit ec: ExecutionContext) extends QueryService {

  def collection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("queries"))

  override def create(query: QueryCreate, username: String): Future[QueryGet] =
    projectService.findById(query.projectId) flatMap {
      case Some(_) =>
        val created = BSONDateTime(System.currentTimeMillis())
        val entity = Query(BSONObjectID.generate(),
          BSONObjectID.parse(query.projectId).get,
          query.label, query.description, query.query, username, username, created, created)
        collection
          .flatMap(_.insert.one(entity))
          .map(_ => QueryGet(entity._id.stringify, query.projectId,
            entity.label, query.description, username, username, created.value, created.value))
    }
}
