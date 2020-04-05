package modules.triplestore.services.impl

import java.io.File

import javax.inject.{Inject, Singleton}
import modules.triplestore.services.RepositoryManager
import org.eclipse.rdf4j.repository.Repository
import org.eclipse.rdf4j.repository.config.RepositoryConfig
import org.eclipse.rdf4j.repository.manager.LocalRepositoryManager
import org.eclipse.rdf4j.repository.sail.config.SailRepositoryConfig
import org.eclipse.rdf4j.sail.nativerdf.config.NativeStoreConfig
import play.api.Configuration
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

@Singleton
class RepositoryManagerImpl @Inject()(conf: Configuration, applicationLifecycle: ApplicationLifecycle) extends RepositoryManager {

  var storageDir = new File(conf.get[String]("app.storageDir"))
  var manager = new LocalRepositoryManager(storageDir)
  manager.init()

  applicationLifecycle.addStopHook(() => {
    Future.successful(manager.shutDown())
  })

  override def getRepository(repositoryId: String): Repository = {
    val backendConfig = new NativeStoreConfig()
    val repositoryTypeSpec = new SailRepositoryConfig(backendConfig)
    val repConfig = new RepositoryConfig(repositoryId, repositoryTypeSpec)
    manager.addRepositoryConfig(repConfig)
    val repository = manager.getRepository(repositoryId)
    repository
  }

  override def removeRepository(repositoryId: String): Boolean = manager.removeRepository(repositoryId)
}
