package modules.graphql.controllers

import javax.inject.{Inject, Singleton}
import modules.graphql.models.GraphQLContext
import modules.graphql.schema.SchemaDefinition
import modules.graphql.services.GraphQLService
import modules.security.services.ProfileService
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.mvc.{Action, AnyContent, InjectedController, Request, Result}
import sangria.execution._
import sangria.marshalling.playJson._
import sangria.parser.{QueryParser, SyntaxError}
import sangria.renderer.SchemaRenderer
import sangria.slowlog.SlowLog

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

@Singleton
class GraphQLController @Inject()(profileService: ProfileService,
                                  graphQLService: GraphQLService)
                                 (implicit ec: ExecutionContext) extends InjectedController {

  def graphql(query: String, variables: Option[String], operation: Option[String]): Action[AnyContent] = Action.async { request =>
    val profile = profileService.getProfile(request).get
    val username = profile.getUsername
    val graphQLContext = GraphQLContext(graphQLService, username)
    executeQuery(query, variables map parseVariables, operation, isTracingEnabled(request), graphQLContext)
  }

  def graphqlPost: Action[JsValue] = Action.async(parse.json) { request =>
    val profile = profileService.getProfile(request).get
    val username = profile.getUsername
    val graphQLContext = GraphQLContext(graphQLService, username)

    val query = (request.body \ "query").as[String]
    val operation = (request.body \ "operationName").asOpt[String]

    val variables = (request.body \ "variables").toOption.flatMap {
      case JsString(vars) => Some(parseVariables(vars))
      case obj: JsObject => Some(obj)
      case _ => None
    }

    executeQuery(query, variables, operation, isTracingEnabled(request), graphQLContext)
  }

  private def executeQuery(query: String, variables: Option[JsObject],
                           operation: Option[String], tracing: Boolean, graphQLContext: GraphQLContext): Future[Result] =
    QueryParser.parse(query) match {
      case Success(queryAst) =>
        Executor.execute(SchemaDefinition.schema, queryAst, graphQLContext,
          operationName = operation,
          variables = variables getOrElse Json.obj(),
          exceptionHandler = exceptionHandler,
          queryReducers = List(
            QueryReducer.rejectMaxDepth[GraphQLContext](15),
            QueryReducer.rejectComplexQueries[GraphQLContext](4000, (_, _) => TooComplexQueryError)),
          middleware = if (tracing) SlowLog.apolloTracing :: Nil else Nil)
          .map(Ok(_))
          .recover {
            case error: QueryAnalysisError => BadRequest(error.resolveError)
            case error: ErrorWithResolver => InternalServerError(error.resolveError)
          }

      // can't parse GraphQL query, return error
      case Failure(error: SyntaxError) =>
        Future.successful(BadRequest(Json.obj(
          "syntaxError" -> error.getMessage,
          "locations" -> Json.arr(Json.obj(
            "line" -> error.originalError.position.line,
            "column" -> error.originalError.position.column)))))

      case Failure(error) =>
        throw error
    }

  def isTracingEnabled(request: Request[_]): Boolean = request.headers.get("X-Apollo-Tracing").isDefined

  private def parseVariables(variables: String): JsObject =
    if (variables.trim == "" || variables.trim == "null") Json.obj() else Json.parse(variables).as[JsObject]

  def renderSchema: Action[AnyContent] = Action {
    Ok(SchemaRenderer.renderSchema(SchemaDefinition.schema))
  }

  lazy val exceptionHandler: ExceptionHandler = ExceptionHandler {
    case (_, error@TooComplexQueryError) => HandledException(error.getMessage)
    case (_, error@MaxQueryDepthReachedError(_)) => HandledException(error.getMessage)
  }

  case object TooComplexQueryError extends Exception("Query is too expensive.")

}
