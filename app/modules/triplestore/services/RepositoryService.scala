package modules.triplestore.services

import com.google.inject.ImplementedBy
import modules.triplestore.services.impl.RepositoryServiceImpl
import org.eclipse.rdf4j.repository.Repository

import scala.concurrent.Future
import scala.util.Try

@ImplementedBy(classOf[RepositoryServiceImpl])
trait RepositoryService {

  def getRepository(repositoryId: String): Repository

  def removeRepository(repositoryId: String): Boolean

  def importRDF(repositoryId: String, fileId: String, baseURI: String,
                graph: String, replaceGraph: Option[Boolean]): Future[Try[Unit]]
}
