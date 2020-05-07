package modules.project.services

import com.google.inject.ImplementedBy
import modules.project.models.{ProjectCreate, ProjectGet}
import modules.project.services.impl.ProjectServiceImpl
import org.eclipse.rdf4j.repository.Repository

import scala.concurrent.Future
import scala.util.Try

@ImplementedBy(classOf[ProjectServiceImpl])
trait ProjectService {
  def create(project: ProjectCreate, username: String): Future[ProjectGet]

  def findAll: Future[Seq[ProjectGet]]

  def findById(projectId: String): Future[Option[ProjectGet]]

  def findRepoById(projectId: String): Future[Option[Repository]]

  def importRDF(projectId: String, fileId: String, baseURI: String,
                graph: String, replaceGraph: Option[Boolean]): Future[Try[Unit]]
}
