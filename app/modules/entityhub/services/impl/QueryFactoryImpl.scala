package modules.entityhub.services.impl

import modules.entityhub.models.QueryType
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.services.QueryFactory
import modules.project.models.{ProjectGet, RepositoryType}

class QueryFactoryImpl extends QueryFactory {
  override def getQuery(queryType: QueryType, proj: ProjectGet, graph: Option[String]): String = proj.repository.`type` match {
    case RepositoryType.Virtuoso => queryType match {
      case QueryType.SearchNodes =>
        "SELECT ?s ?sc (?o AS ?snippet) " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          "  GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?o bif:contains ?term " +
          "   OPTION (score ?sc) " +
          " }} " +
          "ORDER BY DESC (?sc) " +
          "LIMIT 40 "
    }
    case RepositoryType.Native => queryType match {
      case QueryType.SearchNodes => "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
        "SELECT ?s ?sc ?snippet " + (if (graph.isEmpty) "?g" else "") +
        " WHERE { " +
        "  GRAPH ?g { " +
        "   ?s ?p ?o . " +
        "   ?s search:matches [" +
        "   search:query ?term ; " +
        "   search:score ?sc; " +
        "   search:snippet ?snippet ] }} " +
        "LIMIT 40 "
    }

  }
}
