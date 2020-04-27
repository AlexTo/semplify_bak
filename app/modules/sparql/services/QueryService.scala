package modules.sparql.services

import com.google.inject.ImplementedBy
import modules.sparql.models.{QueryCreate, QueryGet, QueryUpdate}
import modules.sparql.services.impl.QueryServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[QueryServiceImpl])
trait QueryService {

  def create(query: QueryCreate, username: String): Future[QueryGet]

  def update(query: QueryUpdate, username: String): Future[QueryGet]

  def findById(id: String): Future[Option[QueryGet]]
}
