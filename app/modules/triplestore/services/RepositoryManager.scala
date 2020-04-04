package modules.triplestore.services

import com.google.inject.ImplementedBy
import modules.triplestore.services.impl.RepositoryManagerImpl
import org.eclipse.rdf4j.repository.Repository

@ImplementedBy(classOf[RepositoryManagerImpl])
trait RepositoryManager {
  def getRepository(repositoryId: String): Repository

  def removeRepository(repositoryId: String): Boolean
}
