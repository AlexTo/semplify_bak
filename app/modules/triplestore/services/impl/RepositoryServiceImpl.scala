package modules.triplestore.services.impl

import java.io.{BufferedReader, File, InputStreamReader}

import akka.stream.Materializer
import akka.stream.scaladsl.FileIO
import javax.inject.{Inject, Singleton}
import modules.fileserver.services.FileService
import modules.triplestore.services.RepositoryService
import org.apache.commons.io.FileUtils
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.LocalRepositoryManager
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.rio.{RDFFormat, Rio}
import org.eclipse.rdf4j.sail.lucene.{LuceneIndex, LuceneSail}
import org.eclipse.rdf4j.sail.lucene.config.LuceneSailConfig
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle

import scala.concurrent.{ExecutionContext, Future}
import akka.stream.scaladsl.StreamConverters

import scala.util.{Try, Using}

@Singleton
class RepositoryServiceImpl @Inject()(conf: Configuration,
                                      fileService: FileService,
                                      applicationLifecycle: ApplicationLifecycle)
                                     (implicit ec: ExecutionContext, m: Materializer)
  extends RepositoryService {

  var storageDir: String = conf.get[String]("app.storageDir")
  val luceneDir: String = conf.get[String]("app.luceneDir")
  var manager = new LocalRepositoryManager(new File(storageDir))
  manager.init()

  applicationLifecycle.addStopHook(() => {
    Future.successful(manager.shutDown())
  })

  override def getRepository(repositoryId: String): Repository = {
    val nativeStoreConfig = new NativeStoreConfig()
    val luceneConfig = new LuceneSailConfig(nativeStoreConfig)
    luceneConfig.setIndexDir(luceneDir)
    luceneConfig.setParameter(LuceneSail.INDEX_CLASS_KEY, classOf[LuceneIndex].getName)
    luceneConfig.setParameter(LuceneSail.LUCENE_RAMDIR_KEY, "false")
    val repositoryTypeSpec = new SailRepositoryConfig(luceneConfig)
    val repConfig = new RepositoryConfig(repositoryId, repositoryTypeSpec)
    manager.addRepositoryConfig(repConfig)
    val repository = manager.getRepository(repositoryId)
    repository
  }

  override def removeRepository(repositoryId: String): Boolean = manager.removeRepository(repositoryId)

  override def importRDF(repositoryId: String, fileId: String, baseURI: String,
                         graph: String, replaceGraph: Option[Boolean]): Future[Try[Unit]] =
    fileService.findById(fileId) map { file =>
      val inputStream = new BufferedReader(new InputStreamReader(
        file.content.runWith(StreamConverters.asInputStream())))
      val repo = getRepository(repositoryId)
      val f = repo.getValueFactory
      Using(repo.getConnection) { conn =>
        conn.add(inputStream, baseURI,
          Rio.getParserFormatForFileName(file.filename).orElse(RDFFormat.RDFXML), f.createIRI(graph))
      }
    }
}