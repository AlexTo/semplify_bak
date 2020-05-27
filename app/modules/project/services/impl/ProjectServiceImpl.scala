package modules.project.services.impl

import java.io.BufferedInputStream

import akka.stream.Materializer
import akka.stream.scaladsl.StreamConverters
import javax.inject.Inject
import modules.fileserver.services.FileService
import modules.project.entities.Project
import modules.project.models.{NativeRepository, ProjectCreate, ProjectGet, VirtuosoRepository}
import modules.project.services.ProjectService
import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.{RepositoryManager, RepositoryProvider}
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.rio.{RDFFormat, Rio}
import org.eclipse.rdf4j.sail.lucene.config.LuceneSailConfig
import org.eclipse.rdf4j.sail.lucene.{LuceneIndex, LuceneSail}
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.Cursor
import reactivemongo.bson.{BSONObjectID, _}
import reactivemongo.play.json._
import reactivemongo.play.json.collection.JSONCollection
import virtuoso.rdf4j.driver.config.VirtuosoRepositoryConfig

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try, Using}

class ProjectServiceImpl @Inject()(reactiveMongoApi: ReactiveMongoApi,
                                   conf: Configuration,
                                   fileService: FileService,
                                   applicationLifecycle: ApplicationLifecycle)
                                  (implicit ex: ExecutionContext, m: Materializer) extends ProjectService {

  val luceneDir: String = conf.get[String]("app.rdf4jWorkBench.luceneDir")
  var rdf4jHost: String = conf.get[String]("app.rdf4jWorkBench.host")
  val manager: RepositoryManager = RepositoryProvider.getRepositoryManager(rdf4jHost)
  manager.init()

  applicationLifecycle.addStopHook(() => {
    Future.successful(manager.shutDown())
  })

  def projectCollection: Future[JSONCollection] = reactiveMongoApi.database.map(_.collection[JSONCollection]("projects"))

  override def create(project: ProjectCreate, username: String): Future[ProjectGet] = {
    val created = BSONDateTime(System.currentTimeMillis())
    val entity = Project(BSONObjectID.generate(),
      project.repository,
      project.title, username, username,
      created, created)
    projectCollection
      .flatMap(_.insert.one(entity))
      .map(_ => ProjectGet(entity._id.stringify, entity.title, project.repository, username, created.value))
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

  override def findRepoById(projectId: String): Future[Option[(ProjectGet, Repository)]] = findById(projectId) map {
    case Some(projectGet) =>
      if (!manager.hasRepositoryConfig(projectId)) {
        val repoConfig = projectGet.repository match {
          case _: NativeRepository =>
            val nativeStoreConfig = new NativeStoreConfig()
            nativeStoreConfig.setTripleIndexes("spoc,posc,cosp")
            val luceneConfig = new LuceneSailConfig(nativeStoreConfig)
            luceneConfig.setIndexDir(luceneDir)
            luceneConfig.setParameter(LuceneSail.INDEX_CLASS_KEY, classOf[LuceneIndex].getName)
            luceneConfig.setParameter(LuceneSail.LUCENE_RAMDIR_KEY, "false")
            val repositoryTypeSpec = new SailRepositoryConfig(luceneConfig)
            val repositoryConfig = new RepositoryConfig(projectId, repositoryTypeSpec)
            repositoryConfig
          case virtuoso: VirtuosoRepository =>
            val virtuosoStoreConfig = new VirtuosoRepositoryConfig()
            virtuosoStoreConfig.setHostList(virtuoso.hostList)
            virtuosoStoreConfig.setUsername(virtuoso.username)
            virtuosoStoreConfig.setPassword(virtuoso.password)
            virtuosoStoreConfig.setDefGraph(virtuoso.defGraph)
            virtuosoStoreConfig.setBatchSize(30000)
            val repositoryConfig = new RepositoryConfig(projectId, virtuosoStoreConfig)
            repositoryConfig
        }
        repoConfig.setTitle(projectGet.title)
        manager.addRepositoryConfig(repoConfig)
      }
      Some((projectGet, manager.getRepository(projectId)))
    case None => None
  }

  override def importRDF(projectId: String, fileId: String, baseURI: String, graph: String, replaceGraph: Option[Boolean]): Future[Try[Unit]] = {
    findRepoById(projectId) flatMap {
      case Some((_, repo)) => fileService.findById(fileId) map { file =>
        val fileInputStream = new BufferedInputStream(file.content.runWith(StreamConverters.asInputStream()), 32768)
        val inputStream =
          if (file.filename.endsWith(".gz"))
            new GzipCompressorInputStream(fileInputStream)
          else if (file.filename.endsWith(".bz2"))
            new BZip2CompressorInputStream(fileInputStream)
          else
            fileInputStream
        val f = repo.getValueFactory
        Using(repo.getConnection) { conn =>
          conn.add(inputStream, baseURI,
            Rio.getParserFormatForFileName(file.filename).orElse(RDFFormat.RDFXML), f.createIRI(graph))
        }
      }
    }
  }
}
