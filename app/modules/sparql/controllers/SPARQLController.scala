package modules.sparql.controllers

import javax.inject.{Inject, Singleton}
import modules.common.models.{Error, ErrorBody}
import modules.sparql.services.SPARQLService
import org.eclipse.rdf4j.repository.http.HTTPQueryEvaluationException
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SPARQLController @Inject()(sparqlService: SPARQLService,
                                 cc: ControllerComponents)
                                (implicit ec: ExecutionContext) extends AbstractController(cc) {
  def execute(projectId: String): Action[AnyContent] = Action.async { request =>
    request.body.asFormUrlEncoded match {
      case Some(kv) =>
        kv.get("query") match {
          case Some(query) =>
            sparqlService.executeQuery(projectId, query.head) map { queryResult =>
              Ok(Json.toJson(queryResult))
            } recover {
              case e: HTTPQueryEvaluationException =>
                BadRequest(Json.toJson(Error(ErrorBody(e.getMessage))))
            }
          case _ => kv.get("update") match {
            case Some(update) =>
              sparqlService.executeUpdate(projectId, update.head)
              Future(Ok)
            case _ =>
              Future(BadRequest)
          }
        }
    }
  }

}
