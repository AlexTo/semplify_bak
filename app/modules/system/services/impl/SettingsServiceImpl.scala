package modules.system.services.impl

import akka.stream.Materializer
import javax.inject.Inject
import modules.project.services.ProjectService
import modules.system.entities._
import modules.system.models.{SettingsCreate, SettingsGet}
import modules.system.services.SettingsService
import play.api.libs.json.JsObject
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.DefaultDB
import reactivemongo.bson.{BSONDocument, BSONObjectID, _}
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

class SettingsServiceImpl @Inject()(projectService: ProjectService,
                                    reactiveMongoApi: ReactiveMongoApi)
                                   (implicit ec: ExecutionContext, m: Materializer) extends SettingsService {

  val database: Future[DefaultDB] = reactiveMongoApi.database

  def collection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("settings"))

  override def findProjectSettings(projectId: String): Future[SettingsGet] = BSONObjectID.parse(projectId) match {
    case Success(id) => collection flatMap {
      val query = BSONDocument("projectId" -> id,
        "scope" -> SettingsScope.Project.toString)
      _.find(query, Option.empty[JsObject]).one[SettingsGet] flatMap {
        case Some(value) => Future(value)
        case None => create(defaultSettings(projectId, None))
      }
    }
  }

  override def findUserSettings(projectId: String, username: String): Future[SettingsGet] = BSONObjectID.parse(projectId) match {
    case Success(id) => collection flatMap {
      val query = BSONDocument("projectId" -> id,
        "scope" -> SettingsScope.Project.toString, "username" -> username, "scope" -> SettingsScope.User.toString)
      _.find(query, Option.empty[JsObject]).one[SettingsGet] flatMap {
        case Some(value) => Future(value)
        case None => findProjectSettings(projectId) flatMap { projectSettings =>
          val defaultUserSettings = SettingsCreate(projectId, Some(username), projectSettings.visualGraph)
          create(defaultUserSettings)
        }
      }
    }
  }


  override def create(settings: SettingsCreate): Future[SettingsGet] = projectService.findById(settings.projectId) flatMap {
    case Some(_) =>
      val settingId = BSONObjectID.generate()
      val created = BSONDateTime(System.currentTimeMillis())
      val entity = Settings(settingId, BSONObjectID.parse(settings.projectId).get,
        settings.username,
        if (settings.username.isEmpty) SettingsScope.Project else SettingsScope.User,
        settings.visualGraph, created, created)
      collection
        .flatMap(_.insert.one(entity))
        .map(_ => SettingsGet(settingId.stringify, settings.projectId, settings.username,
          if (settings.username.isEmpty) SettingsScope.Project else SettingsScope.User,
          settings.visualGraph, created.value, created.value))
  }

  def defaultSettings(projectId: String, username: Option[String]): SettingsCreate =
    SettingsCreate(projectId, username = username, VisualGraph(
      NodeRenderer(Map.empty),
      EdgeRenderer(includePreds = Seq.empty, excludePreds = Seq.empty, EdgeFilterMode.Exclusive)))

}
