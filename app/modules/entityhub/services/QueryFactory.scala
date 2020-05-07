package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.services.impl.QueryFactoryImpl
import org.eclipse.rdf4j.repository.Repository

@ImplementedBy(classOf[QueryFactoryImpl])
trait QueryFactory {
  def getQuery(queryType: QueryType, repo: Repository, graph: Option[String]): String
}
