package modules.triplestore.services.impl

import java.io.{BufferedReader, File, InputStreamReader}

import akka.stream.Materializer
import akka.stream.scaladsl.StreamConverters
import javax.inject.{Inject, Singleton}
import modules.fileserver.services.FileService
import modules.project.entities.NativeRepository
import modules.project.models.ProjectGet
import modules.triplestore.entities.VirtuosoRepository
import modules.triplestore.models._
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.LocalRepositoryManager
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.rio.{RDFFormat, Rio}
import org.eclipse.rdf4j.sail.lucene.config.LuceneSailConfig
import org.eclipse.rdf4j.sail.lucene.{LuceneIndex, LuceneSail}
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle
import play.api.libs.json.JsObject
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.bson.{BSONDateTime, BSONDocument, BSONObjectID}
import reactivemongo.play.json.collection._
import reactivemongo.play.json._
import virtuoso.rdf4j.driver.config.VirtuosoRepositoryConfig

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Success, Try, Using}

@Singleton
class RepositoryServiceImpl @Inject()(conf: Configuration,
                                      fileService: FileService,
                                      reactiveMongoApi: ReactiveMongoApi,
                                      applicationLifecycle: ApplicationLifecycle)
                                     (implicit ec: ExecutionContext, m: Materializer)
  extends RepositoryService {

  def repoCollection: Future[JSONCollection]
  = reactiveMongoApi.database.map(_.collection[JSONCollection]("repositories"))

  var storageDir: String = conf.get[String]("app.storageDir")
  val luceneDir: String = conf.get[String]("app.luceneDir")
  var manager = new LocalRepositoryManager(new File(storageDir))
  manager.init()

  applicationLifecycle.addStopHook(() => {
    Future.successful(manager.shutDown())
  })

  override def findById(repositoryId: String): Future[Repository] = {

    if (manager.hasRepositoryConfig(repositoryId)) {
      Future(manager.getRepository(repositoryId))
    } else {
      BSONObjectID.parse(repositoryId) match {
        case Success(id) => repoCollection.flatMap {
          val query = BSONDocument("_id" -> id)
          _.find(query, Option.empty[JsObject])
            .one[RepositoryGet]
        } map {
          case Some(_: NativeRepositoryGet) =>
            val nativeStoreConfig = new NativeStoreConfig()
            val luceneConfig = new LuceneSailConfig(nativeStoreConfig)
            luceneConfig.setIndexDir(luceneDir)
            luceneConfig.setParameter(LuceneSail.INDEX_CLASS_KEY, classOf[LuceneIndex].getName)
            luceneConfig.setParameter(LuceneSail.LUCENE_RAMDIR_KEY, "false")
            val repositoryTypeSpec = new SailRepositoryConfig(luceneConfig)
            val repoConfig = new RepositoryConfig(repositoryId, repositoryTypeSpec)
            manager.addRepositoryConfig(repoConfig)
            manager.getRepository(repositoryId)
          case Some(virtuoso: VirtuosoRepositoryGet) =>
            val virtuosoStoreConfig = new VirtuosoRepositoryConfig()
            virtuosoStoreConfig.setHostList(virtuoso.hostList)
            val repoConfig = new RepositoryConfig(repositoryId, virtuosoStoreConfig)
            manager.addRepositoryConfig(repoConfig)
            manager.getRepository(repositoryId)
        }
      }
    }
  }

  override def removeRepository(repositoryId: String): Boolean = manager.removeRepository(repositoryId)

  override def importRDF(repositoryId: String, fileId: String, baseURI: String,
                         graph: String, replaceGraph: Option[Boolean]): Future[Try[Unit]] =
    fileService.findById(fileId) map { file =>
      val inputStream = new BufferedReader(new InputStreamReader(
        file.content.runWith(StreamConverters.asInputStream())))
      val repo = findById(repositoryId)
      val f = repo.getValueFactory
      Using(repo.getConnection) { conn =>
        conn.add(inputStream, baseURI,
          Rio.getParserFormatForFileName(file.filename).orElse(RDFFormat.RDFXML), f.createIRI(graph))
      }
    }

  override def create(repositoryCreate: RepositoryCreate): Future[RepositoryGet] = {
    val created = BSONDateTime(System.currentTimeMillis())
    repositoryCreate match {
      case native: NativeRepositoryCreate =>
        val entity = NativeRepository(_id = id, created = created, modified = created)
        repoCollection.flatMap(_.insert.one(entity)).map { _ =>
          NativeRepositoryGet(id = id.stringify)
        }
      case virtuoso: VirtuosoRepositoryCreate =>
        val entity = VirtuosoRepository(_id = id, created = created, modified = created)
        repoCollection.flatMap(_.insert.one(entity)).map { _ =>
          VirtuosoRepositoryGet(id = id.stringify)
        }
    }
  }
}