package modules.graphql.schema

import modules.entityhub.models._
import modules.fileserver.models.FileInfo
import modules.graphql.services.GraphQLService
import modules.project.models.{NativeRepository, ProjectGet, Repository, VirtuosoRepository}
import modules.sparql.models.QueryGet
import modules.task.models.TaskGet
import modules.webcrawler.models.PageGet
import sangria.marshalling.FromInput
import sangria.schema._
import sangria.util.tag.@@

object SchemaDefinition {

  val Repository: InterfaceType[GraphQLService, Repository] =
    InterfaceType("Repository", "An interface that represent a generic repository",
      () => fields[GraphQLService, Repository](
        Field("type", StringType, resolve = _.value.`type`.toString)
      )
    )

  val NativeRepository: ObjectType[GraphQLService, NativeRepository] = ObjectType("NativeRepository",
    "An RDF4J repository", interfaces[GraphQLService, NativeRepository](Repository),
    () => fields[GraphQLService, NativeRepository](
      Field("type", StringType, resolve = _.value.`type`.toString),
    )
  )

  val VirtuosoRepository: ObjectType[GraphQLService, VirtuosoRepository] = ObjectType("VirtuosoRepository",
    "An Virtuoso repository", interfaces[GraphQLService, VirtuosoRepository](Repository),
    () => fields[GraphQLService, VirtuosoRepository](
      Field("type", StringType, resolve = _.value.`type`.toString),
      Field("hostList", StringType, resolve = _.value.hostList),
    )
  )

  val Value: InterfaceType[GraphQLService, modules.entityhub.models.Value] =
    InterfaceType("Value", "An interface that represents a generic value in an RDF graph",
      () => fields[GraphQLService, modules.entityhub.models.Value](
        Field("projectId", StringType, resolve = _.value.projectId),
        Field("graph", OptionType(StringType), resolve = _.value.graph),
        Field("value", StringType, resolve = _.value.value),
      )
    )

  val IRI: ObjectType[GraphQLService, IRI] = ObjectType("IRI", "An RDF IRI",
    interfaces[GraphQLService, IRI](Value),
    () => fields[GraphQLService, IRI](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("prefLabel", OptionType(Literal), resolve = ctx => ctx.ctx.prefLabel(ctx.value.projectId, ctx.value.value)),
      Field("depiction", OptionType(IRI), resolve = ctx => ctx.ctx.depiction(ctx.value.projectId, ctx.value.value)),
      Field("outGoingPredicates", ListType(Triple),
        resolve = ctx => ctx.ctx.triplesFromNode(ctx.value.projectId, None, ctx.value.value, None)),
      Field("incomingPredicates", ListType(Triple),
        resolve = ctx => ctx.ctx.triplesToNode(ctx.value.projectId, None, ctx.value.value))
    ))

  val Literal: ObjectType[GraphQLService, Literal] = ObjectType("Literal", "An RDF Literal",
    interfaces[GraphQLService, Literal](Value),
    () => fields[GraphQLService, Literal](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("lang", OptionType(StringType), resolve = _.value.lang),
      Field("dataType", StringType, resolve = _.value.dataType),
    ))

  val BNode: ObjectType[GraphQLService, BNode] = ObjectType("BNode", "An RDF BNode",
    interfaces[GraphQLService, BNode](Value),
    () => fields[GraphQLService, BNode](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value))
  )

  val Triple: ObjectType[GraphQLService, Triple] = ObjectType("Triple", "An RDF triple",
    () => fields[GraphQLService, Triple](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("subj", IRI, resolve = _.value.subj),
      Field("pred", IRI, resolve = _.value.pred),
      Field("obj", Value, resolve = _.value.obj),
    ))

  val WebPage: ObjectType[GraphQLService, PageGet] = ObjectType("WebPage",
    () => fields[GraphQLService, PageGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("url", StringType, resolve = _.value.url),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("content", StringType, resolve = _.value.content),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("domain", OptionType(StringType), resolve = _.value.domain)
    )
  )

  val Task: ObjectType[GraphQLService, TaskGet] = ObjectType("Task",
    () => fields[GraphQLService, TaskGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("type", StringType, resolve = _.value.`type`),
      Field("status", StringType, resolve = _.value.status),
    ))

  val Project: ObjectType[GraphQLService, ProjectGet] = ObjectType("Project",
    () => fields[GraphQLService, ProjectGet](
      Field("id", StringType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title),
      Field("repository", Repository, resolve = _.value.repository),
      Field("createdBy", StringType, resolve = _.value.createdBy)
    ))

  val SearchHit: ObjectType[GraphQLService, SearchHit] = ObjectType("SearchHit",
    () => fields[GraphQLService, SearchHit](
      Field("node", IRI, resolve = _.value.node),
      Field("snippet", StringType, resolve = _.value.snippet),
      Field("score", FloatType, resolve = _.value.score)
    )
  )
  val Graph: ObjectType[GraphQLService, GraphGet] = ObjectType("Graph",
    () => fields[GraphQLService, GraphGet](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("value", StringType, resolve = _.value.value)
    )
  )

  val SparqlQuery: ObjectType[GraphQLService, QueryGet] = ObjectType("SparqlQuery",
    () => fields[GraphQLService, QueryGet](
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

  val FileInfo: ObjectType[GraphQLService, FileInfo] = ObjectType("FileInfo",
    () => fields[GraphQLService, FileInfo](
      Field("id", StringType, resolve = _.value.id),
      Field("filename", StringType, resolve = _.value.filename),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("uploadDate", OptionType(LongType), resolve = _.value.uploadDate),
    ))

  val ProjectIdArg: Argument[String] = Argument("projectId", StringType)
  val GraphArg: Argument[Option[String]] = Argument("graph", OptionInputType(StringType))
  val NodeTypeArg: Argument[Option[String]] = Argument("nodeType", OptionInputType(StringType))
  val GraphsArg: Argument[Seq[String @@ FromInput.CoercedScalaResult]] = Argument("graphs", ListInputType(StringType))
  val FileIdsArg: Argument[Seq[String @@ FromInput.CoercedScalaResult]] = Argument("fileIds", ListInputType(StringType))

  val UriArg: Argument[String] = Argument("uri", StringType)
  val TermArg: Argument[String] = Argument("term", StringType)


  val Query: ObjectType[GraphQLService, Unit] = ObjectType(
    "Query", fields[GraphQLService, Unit](
      Field("node", OptionType(IRI),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: Nil,
        resolve = ctx => ctx.ctx.node(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg UriArg)
      ),
      Field("triplesFromNode", ListType(Triple),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: NodeTypeArg :: Nil,
        resolve = ctx => ctx.ctx.triplesFromNode(ctx arg ProjectIdArg, ctx arg GraphArg,
          ctx arg UriArg, ctx arg NodeTypeArg)
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

  val Mutation: ObjectType[GraphQLService, Unit] = ObjectType(
    "Mutation", fields[GraphQLService, Unit](
      Field("deleteGraphs", ListType(Graph),
        arguments = ProjectIdArg :: GraphsArg :: Nil,
        resolve = ctx => ctx.ctx.deleteGraphs(ctx arg ProjectIdArg, ctx arg GraphsArg)
      ),
      Field("deleteFiles", ListType(FileInfo),
        arguments = ProjectIdArg :: FileIdsArg :: Nil,
        resolve = ctx => ctx.ctx.deleteFiles(ctx arg ProjectIdArg, ctx arg FileIdsArg)
      )
    ))

  val schema: Schema[GraphQLService, Unit] = Schema(Query, Some(Mutation),
    additionalTypes = NativeRepository :: VirtuosoRepository :: Literal :: BNode :: Nil)
}
