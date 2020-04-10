package modules.triplestore.services.impl

import java.io.File

import javax.inject.{Inject, Singleton}
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.LocalRepositoryManager
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.sail.lucene.{LuceneIndex, LuceneSail}
import org.eclipse.rdf4j.sail.lucene.config.LuceneSailConfig
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

@Singleton
class RepositoryServiceImpl @Inject()(conf: Configuration, applicationLifecycle: ApplicationLifecycle)
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
}
