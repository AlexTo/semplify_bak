package modules.project.services

import com.google.inject.ImplementedBy
import modules.project.models.{ProjectCreate, ProjectGet}
import modules.project.services.impl.ProjectServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[ProjectServiceImpl])
trait ProjectService {
  def create(project: ProjectCreate, username: String): Future[ProjectGet]
}
