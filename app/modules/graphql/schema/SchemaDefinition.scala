package modules.graphql.schema

import modules.entityhub.models._
import modules.fileserver.models.FileInfo
import modules.graphql.services.Repository
import modules.project.models.ProjectGet
import modules.sparql.models.QueryGet
import modules.task.models.TaskGet
import modules.webcrawler.models.PageGet
import sangria.marshalling.FromInput
import sangria.schema._
import sangria.util.tag.@@

object SchemaDefinition {

  val Value: InterfaceType[Repository, modules.entityhub.models.Value] =
    InterfaceType("Value", "An interface that represents a generic value in an RDF graph",
      () => fields[Repository, modules.entityhub.models.Value](
        Field("projectId", StringType, resolve = _.value.projectId),
        Field("graph", OptionType(StringType), resolve = _.value.graph),
        Field("value", StringType, resolve = _.value.value),
      )
    )

  val IRI: ObjectType[Repository, IRI] = ObjectType("IRI", "An RDF IRI",
    interfaces[Repository, IRI](Value),
    () => fields[Repository, IRI](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("prefLabel", OptionType(Literal), resolve = ctx => ctx.ctx.prefLabel(ctx.value.projectId, ctx.value.value)),
      Field("outGoingPredicates", ListType(Predicate),
        resolve = ctx => ctx.ctx.predicatesFromNode(ctx.value.projectId, None, ctx.value.value)),
      Field("incomingPredicates", ListType(Predicate),
        resolve = ctx => ctx.ctx.predicatesToNode(ctx.value.projectId, None, ctx.value.value))
    ))

  val Literal: ObjectType[Repository, Literal] = ObjectType("Literal", "An RDF Literal",
    interfaces[Repository, Literal](Value),
    () => fields[Repository, Literal](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("lang", OptionType(StringType), resolve = _.value.lang),
      Field("dataType", StringType, resolve = _.value.dataType),
    ))

  val BNode: ObjectType[Repository, BNode] = ObjectType("BNode", "An RDF BNode",
    interfaces[Repository, BNode](Value),
    () => fields[Repository, BNode](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value))
  )

  val Predicate: ObjectType[Repository, Predicate] = ObjectType("Predicate", "An RDF predicate",
    interfaces[Repository, Predicate](Value),
    () => fields[Repository, Predicate](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("prefLabel", OptionType(Literal), resolve = ctx => ctx.ctx.prefLabel(ctx.value.projectId, ctx.value.value)),
      Field("from", IRI, resolve = _.value.from),
      Field("to", Value, resolve = _.value.to),
    ))

  val WebPage: ObjectType[Repository, PageGet] = ObjectType("WebPage",
    () => fields[Repository, PageGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("url", StringType, resolve = _.value.url),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("content", StringType, resolve = _.value.content),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("domain", OptionType(StringType), resolve = _.value.domain)
    )
  )

  val Task: ObjectType[Repository, TaskGet] = ObjectType("Task",
    () => fields[Repository, TaskGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("type", StringType, resolve = _.value.`type`),
      Field("status", StringType, resolve = _.value.status),
    ))

  val Project: ObjectType[Repository, ProjectGet] = ObjectType("Project",
    () => fields[Repository, ProjectGet](
      Field("id", StringType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title)
    ))

  val SearchHit: ObjectType[Repository, SearchHit] = ObjectType("SearchHit",
    () => fields[Repository, SearchHit](
      Field("node", IRI, resolve = _.value.node),
      Field("snippet", StringType, resolve = _.value.snippet),
      Field("score", FloatType, resolve = _.value.score)
    )
  )
  val Graph: ObjectType[Repository, GraphGet] = ObjectType("Graph",
    () => fields[Repository, GraphGet](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("value", StringType, resolve = _.value.value)
    )
  )

  val SparqlQuery: ObjectType[Repository, QueryGet] = ObjectType("SparqlQuery",
    () => fields[Repository, QueryGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("title", StringType, resolve = _.value.title),
      Field("description", OptionType(StringType), resolve = _.value.description),
      Field("query", StringType, resolve = _.value.query),
      Field("created", LongType, resolve = _.value.created),
      Field("modified", LongType, resolve = _.value.modified),
      Field("createdBy", StringType, resolve = _.value.createdBy),
      Field("modifiedBy", StringType, resolve = _.value.modifiedBy)
    ))

  val FileInfo: ObjectType[Repository, FileInfo] = ObjectType("FileInfo",
    () => fields[Repository, FileInfo](
      Field("id", StringType, resolve = _.value.id),
      Field("filename", StringType, resolve = _.value.filename),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("uploadDate", OptionType(LongType), resolve = _.value.uploadDate),
    ))

  val ProjectIdArg: Argument[String] = Argument("projectId", StringType)
  val GraphArg: Argument[Option[String]] = Argument("graph", OptionInputType(StringType))
  val GraphsArg = Argument("graphs", ListInputType(StringType))

  val UriArg: Argument[String] = Argument("uri", StringType)
  val TermArg: Argument[String] = Argument("term", StringType)


  val Query: ObjectType[Repository, Unit] = ObjectType(
    "Query", fields[Repository, Unit](
      Field("node", OptionType(IRI),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: Nil,
        resolve = ctx => ctx.ctx.node(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg UriArg)
      ),
      Field("predicatesFromNode", ListType(Predicate),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: Nil,
        resolve = ctx => ctx.ctx.predicatesFromNode(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg UriArg)
      ),
      Field("files", ListType(FileInfo),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.files(ctx arg ProjectIdArg)
      ),
      Field("projects", ListType(Project),
        resolve = ctx => ctx.ctx.projects()
      ),

      Field("graphs", ListType(Graph),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.graphs(ctx arg ProjectIdArg)
      ),

      Field("crawledPages", ListType(WebPage),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.crawledPages(ctx arg ProjectIdArg)
      ),
      Field("searchNodes", ListType(SearchHit),
        arguments = ProjectIdArg :: GraphArg :: TermArg :: Nil,
        resolve = ctx => ctx.ctx.searchNodes(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg TermArg)
      ),
      Field("sparqlQueries", ListType(SparqlQuery),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.sparqlQueries(ctx arg ProjectIdArg)
      )
    ))

  val Mutation = ObjectType(
    "Mutation", fields[Repository, Unit](
      Field("deleteGraphs", ListType(Graph),
        arguments = ProjectIdArg :: GraphsArg :: Nil,
        resolve = ctx => ctx.ctx.deleteGraphs(ctx arg ProjectIdArg, ctx arg GraphsArg)
      )
    ))

  val schema: Schema[Repository, Unit] = Schema(Query, Some(Mutation), additionalTypes = Literal :: BNode :: Nil)
}
