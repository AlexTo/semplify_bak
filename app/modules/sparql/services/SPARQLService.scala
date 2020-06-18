package modules.sparql.services

import com.google.inject.ImplementedBy
import modules.sparql.models.QueryResult
import modules.sparql.services.impl.SPARQLServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[SPARQLServiceImpl])
trait SPARQLService {
  def executeQuery(projectId: String, query: String): Future[QueryResult]

  def executeUpdate(projectId: String, update: String)

}
