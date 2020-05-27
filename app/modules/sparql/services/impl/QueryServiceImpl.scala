package modules.sparql.services.impl

import javax.inject.Inject
import modules.project.services.ProjectService
import modules.sparql.entities.Query
import modules.sparql.models.{QueryCreate, QueryGet, QueryUpdate}
import modules.sparql.services.QueryService
import play.api.libs.json.JsObject
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.Cursor
import reactivemongo.bson.{BSONDateTime, BSONDocument, BSONObjectID}
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

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
          query.title, query.description, query.query, username, username, created, created)
        collection
          .flatMap(_.insert.one(entity))
          .map(_ => QueryGet(entity._id.stringify, query.projectId,
            entity.title, query.description, query.query, username, username, created.value, created.value))
    }

  override def update(query: QueryUpdate, username: String): Future[QueryGet] = findById(query.id) flatMap {
    case Some(queryGet) =>
      val modified = BSONDateTime(System.currentTimeMillis())
      collection.flatMap { coll =>
        val q = BSONDocument("_id" -> BSONObjectID.parse(queryGet.id).get)
        val u = BSONDocument("$set" -> BSONDocument(
          "title" -> query.title,
          "description" -> query.description,
          "query" -> query.query,
          "modifiedBy" -> username,
          "modified" -> modified))
        coll.update.one(q, u, upsert = false, multi = false) map { _ =>
          QueryGet(queryGet.id, queryGet.projectId, query.title, query.description, query.query,
            queryGet.createdBy, username, queryGet.created, modified.value)
        }
      }
  }

  override def findById(id: String): Future[Option[QueryGet]] = BSONObjectID.parse(id) match {
    case Success(id) => collection.flatMap {
      val query = BSONDocument("_id" -> id)
      _.find(query, Option.empty[JsObject])
        .one[QueryGet]
    }
    case Failure(_) => Future.successful(None)
  }

  override def findAll(projectId: String): Future[Seq[QueryGet]] = BSONObjectID.parse(projectId) match {
    case Success(id) => collection map {
      _.find(BSONDocument("projectId" -> id), Option.empty[JsObject]).cursor[QueryGet]()
    } flatMap {
      _.collect[Seq](-1, Cursor.FailOnError[Seq[QueryGet]]())
    }
  }
}
