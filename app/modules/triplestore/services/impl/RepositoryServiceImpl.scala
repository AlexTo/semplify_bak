package modules.triplestore.services.impl

import java.io.File

import javax.inject.{Inject, Singleton}
import modules.triplestore.services.RepositoryService
import org.eclipse.rdf4j.model.Model
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.LocalRepositoryManager
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.sail.lucene.LuceneSail
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import org.eclipse.rdf4j.sail.solr.SolrIndex
import org.eclipse.rdf4j.sail.solr.config.SolrSailConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

@Singleton
class RepositoryServiceImpl @Inject()(conf: Configuration, applicationLifecycle: ApplicationLifecycle)
  extends RepositoryService {

  var storageDir: String = conf.get[String]("app.storageDir")
  var manager = new LocalRepositoryManager(new File(storageDir))
  manager.init()

  applicationLifecycle.addStopHook(() => {
    Future.successful(manager.shutDown())
  })

  override def getRepository(repositoryId: String): Repository = {
    val nativeStoreConfig = new NativeStoreConfig()
    /*
    val solrConfig = new SolrSailConfig(nativeStoreConfig)
    solrConfig.setParameter(LuceneSail.INDEX_CLASS_KEY, classOf[SolrIndex].getName)
    solrConfig.setParameter(SolrIndex.SERVER_KEY, "embedded:")
    solrConfig.setIndexDir(storageDir)
     */
    val repositoryTypeSpec = new SailRepositoryConfig(nativeStoreConfig)
    val repConfig = new RepositoryConfig(repositoryId, repositoryTypeSpec)
    manager.addRepositoryConfig(repConfig)
    val repository = manager.getRepository(repositoryId)
    repository
  }

  override def removeRepository(repositoryId: String): Boolean = manager.removeRepository(repositoryId)
}
