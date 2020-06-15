package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.services.impl.QueryFactoryImpl
import modules.project.models.ProjectGet

@ImplementedBy(classOf[QueryFactoryImpl])
trait QueryFactory {
  def getSearchQuery(queryType: QueryType, proj: ProjectGet, graph: Option[String], term: String,
                     limit: Option[Int] = None, offset: Option[Int] = None): String
}
