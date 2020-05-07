package modules.sparql.services.impl

import javax.inject.Inject
import modules.project.services.ProjectService
import modules.sparql.models.{Head, QueryResult, Results, Value}
import modules.sparql.services.SPARQLService
import modules.sparql.utils.ValueUtils
import org.eclipse.rdf4j.query.QueryLanguage

import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._
import scala.util.{Success, Using}

class SPARQLServiceImpl @Inject()(projectService: ProjectService)
                                 (implicit ec: ExecutionContext) extends SPARQLService {
  override def executeQuery(projectId: String, query: String): Future[QueryResult] =
    projectService.findRepoById(projectId) map {
      case Some(repo) =>
        val r = repo
        Using(repo.getConnection) { conn =>
          val tq = conn.prepareTupleQuery(QueryLanguage.SPARQL, query)
          val result = tq.evaluate()
          val head = Head(result.getBindingNames.asScala.toSeq)
          val bindings = new ListBuffer[Map[String, Value]]
          while (result.hasNext) {
            val row = result.next()
            bindings.addOne(row.asScala.map(b => b.getName -> ValueUtils.createValue(b.getValue)).toMap)
          }
          val results = new Results(bindings.toSeq)
          val queryResult = new QueryResult(head, results)
          queryResult
        } match {
          case Success(value) => value
        }
    }


  override def executeUpdate(projectId: String, update: String): Unit = ???


}
