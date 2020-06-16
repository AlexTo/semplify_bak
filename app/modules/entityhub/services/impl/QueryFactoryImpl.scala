package modules.entityhub.services.impl

import modules.entityhub.models.QueryType
import modules.entityhub.models.QueryType.QueryType
import modules.entityhub.services.QueryFactory
import modules.project.models.{ProjectGet, RepositoryType}

class QueryFactoryImpl extends QueryFactory {
  override def getSearchQuery(queryType: QueryType, proj: ProjectGet, graph: Option[String], term: String,
                              limit: Option[Int], offset: Option[Int]): String = proj.repository.`type` match {
    case RepositoryType.Virtuoso => queryType match {
      case QueryType.SearchSubjs =>

        val graphPattern = " GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?o bif:contains ?term " +
          "   OPTION (score ?sc) " +
          " }"

        val countQ = "SELECT (COUNT(DISTINCT ?s) as ?s) ('0' AS ?sc) ('' AS ?snippet) " + (if (graph.isEmpty) "('sesame:nil' AS ?g) " else "") +
          "WHERE {" +
          graphPattern +
          "}"

        // http://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksHowToHandleBandwidthLimitExceed
        val mainQ = "SELECT  ?s ?sc ?snippet ?g WHERE { " +
          "SELECT ?s ?sc (?o AS ?snippet) " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          graphPattern +
          " } " +
          "ORDER BY DESC (?sc) } " +
          (if (limit.isDefined) s"LIMIT ${limit.get} " else "") +
          (if (offset.isDefined) s"OFFSET ${offset.get} " else "")

        s"SELECT * { { $countQ } UNION { $mainQ } }"

      case QueryType.SearchPreds =>

        val graphPattern = " GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?o bif:contains ?term " +
          "   OPTION (score ?sc) " +
          " } " +
          " FILTER EXISTS { GRAPH ?g1 { ?s1 ?s ?s2 }} "

        val countQ = "SELECT (COUNT(DISTINCT ?s) as ?s) ('0' AS ?sc) ('' AS ?snippet) " + (if (graph.isEmpty) "('sesame:nil' AS ?g)" else "") +
          "WHERE {" +
          graphPattern +
          "}"

        val mainQ = "SELECT ?s ?sc (?o AS ?snippet) " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          graphPattern +
          " } " +
          "ORDER BY DESC (?sc) " +
          (if (limit.isDefined) s"LIMIT ${limit.get} " else "") +
          (if (offset.isDefined) s"OFFSET ${offset.get} " else "")

        s"SELECT * { { $countQ } UNION { $mainQ } }"


      case QueryType.SearchObjs =>

        // if searching for objs, allows search term to be empty string

        val graphPattern = if (term.trim.length > 0)
          " GRAPH ?g { " +
            "   ?s1 ?s2 ?s . " +
            "   ?s ?p ?o . " +
            "   ?o bif:contains ?term " +
            "   OPTION (score ?sc) " +
            " } "
        else
          " GRAPH ?g { " +
            "   ?s1 ?s2 ?s . " +
            " BIND ('' as ?o) " +
            " BIND ('0' as ?sc) " +
            " } "

        val countQ = "SELECT (COUNT(DISTINCT ?s) as ?s) ('0' AS ?sc) ('' AS ?snippet) " + (if (graph.isEmpty) "('sesame:nil' AS ?g)" else "") +
          "WHERE {" +
          graphPattern +
          "}"

        val mainQ = "SELECT ?s ?sc (?o AS ?snippet) " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          graphPattern +
          " } " +
          "ORDER BY DESC (?sc) " +
          (if (limit.isDefined) s"LIMIT ${limit.get} " else "") +
          (if (offset.isDefined) s"OFFSET ${offset.get} " else "")

        s"SELECT * { { $countQ } UNION { $mainQ } }"
    }

    case RepositoryType.Native => queryType match {
      case QueryType.SearchSubjs =>

        val graphPattern = " GRAPH ?g { " +
          "   ?s ?p ?o . " +
          "   ?s search:matches [" +
          "   search:query ?term ; " +
          "   search:score ?sc; " +
          "   search:snippet ?snippet ] }"

        val mainQ = "SELECT ?s ?sc ?snippet " + (if (graph.isEmpty) "?g" else "") +
          " WHERE { " +
          graphPattern +
          " } " +
          "ORDER BY DESC (?sc) " +
          (if (limit.isDefined) s"LIMIT ${limit.get} " else "") +
          (if (offset.isDefined) s"OFFSET ${offset.get} " else "")

        val countQ = "SELECT (COUNT(*) as ?s) ('0' AS ?sc) ('' AS ?snippet) " + (if (graph.isEmpty) "('sesame:nil' AS ?g)" else "") +
          "WHERE {" +
          graphPattern +
          "}"

        s"PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
          s"SELECT * { { $countQ } UNION { $mainQ } }"

      case QueryType.SearchPreds => "PREFIX search: <http://www.openrdf.org/contrib/lucenesail#> " +
        "SELECT ?p ?sc ?snippet " + (if (graph.isEmpty) "?g" else "") +
        " WHERE { " +
        "  GRAPH ?g { " +
        "   ?s ?p ?o . " +
        "   ?p search:matches [" +
        "   search:query ?term ; " +
        "   search:score ?sc; " +
        "   search:snippet ?snippet ] }} " +
        "LIMIT 40 "
    }

  }
}
