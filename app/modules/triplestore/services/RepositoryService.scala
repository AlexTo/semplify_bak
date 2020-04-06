package modules.triplestore.services

import com.google.inject.ImplementedBy
import modules.triplestore.services.impl.RepositoryServiceImpl
import org.eclipse.rdf4j.repository.Repository

@ImplementedBy(classOf[RepositoryServiceImpl])
trait RepositoryService {

  def getRepository(repositoryId: String): Repository

  def removeRepository(repositoryId: String): Boolean
}
