package modules.sparql.services

import com.google.inject.ImplementedBy
import modules.sparql.models.{QueryCreate, QueryGet}
import modules.sparql.services.impl.QueryServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[QueryServiceImpl])
trait QueryService {
  def create(query: QueryCreate, username: String): Future[QueryGet]
}
