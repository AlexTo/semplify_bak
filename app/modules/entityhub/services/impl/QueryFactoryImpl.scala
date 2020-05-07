package modules.entityhub.services.impl

import modules.entityhub.models.QueryType
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.services.QueryFactory
import org.eclipse.rdf4j.repository.Repository
import virtuoso.rdf4j.driver.VirtuosoRepository

class QueryFactoryImpl extends QueryFactory {
  override def getQuery(queryType: QueryType, repo: Repository, graph: Option[String]): String = repo match {
    case _: VirtuosoRepository => queryType match {
      case QueryType.SearchNodes =>
        "SELECT ?s ?sc (?o AS ?snippet) " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          "  GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?o bif:contains ?term " +
          "   OPTION (score ?sc) " +
          " }} " +
          "ORDER BY DESC (?sc) " +
          "LIMIT 20 "
    }
    case _ => queryType match {
      case QueryType.SearchNodes => "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
        "SELECT ?s ?sc ?snippet " + (if (graph.isEmpty) "?g" else "") +
        " WHERE { " +
        "  GRAPH ?g { " +
        "   ?s ?p ?o . " +
        "   ?s search:matches [" +
        "   search:query ?term ; " +
        "   search:score ?sc; " +
        "   search:snippet ?snippet ] }} " +
        "LIMIT 20 "
    }

  }
}
