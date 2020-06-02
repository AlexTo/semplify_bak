package modules.graphql.schema

import modules.entityhub.models._
import modules.fileserver.models.FileInfo
import modules.graphql.models.GraphQLContext
import modules.project.models.{NativeRepository, ProjectGet, Repository, VirtuosoRepository}
import modules.sparql.models.QueryGet
import modules.system.entities.{ColorMap, EdgeFilterMode, EdgeRenderer, NodeRenderer, VisualGraph}
import modules.system.models.SettingsGet
import modules.task.models.TaskGet
import modules.webcrawler.models.PageGet
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema._
import sangria.util.tag.@@
import sangria.marshalling.playJson._

object SchemaDefinition {

  val Repository: InterfaceType[GraphQLContext, Repository] =
    InterfaceType("Repository", "An interface that represent a generic repository",
      () => fields[GraphQLContext, Repository](
        Field("type", StringType, resolve = _.value.`type`.toString)))

  val NativeRepository: ObjectType[GraphQLContext, NativeRepository] = ObjectType("NativeRepository",
    "An RDF4J repository", interfaces[GraphQLContext, NativeRepository](Repository),
    () => fields[GraphQLContext, NativeRepository](
      Field("type", StringType, resolve = _.value.`type`.toString)))

  val VirtuosoRepository: ObjectType[GraphQLContext, VirtuosoRepository] = ObjectType("VirtuosoRepository",
    "An Virtuoso repository", interfaces[GraphQLContext, VirtuosoRepository](Repository),
    () => fields[GraphQLContext, VirtuosoRepository](
      Field("type", StringType, resolve = _.value.`type`.toString),
      Field("hostList", StringType, resolve = _.value.hostList)))

  val Value: InterfaceType[GraphQLContext, modules.entityhub.models.Value] =
    InterfaceType("Value", "An interface that represents a generic value in an RDF graph",
      () => fields[GraphQLContext, modules.entityhub.models.Value](
        Field("projectId", StringType, resolve = _.value.projectId),
        Field("graph", OptionType(StringType), resolve = _.value.graph),
        Field("value", StringType, resolve = _.value.value)))

  val IRI: ObjectType[GraphQLContext, IRI] = ObjectType("IRI", "An RDF IRI",
    interfaces[GraphQLContext, IRI](Value),
    () => fields[GraphQLContext, IRI](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("prefLabel", OptionType(Literal), resolve = ctx => ctx.ctx.svc.prefLabel(ctx.value.projectId, ctx.value.value)),
      Field("depiction", OptionType(IRI), resolve = ctx => ctx.ctx.svc.depiction(ctx.value.projectId, ctx.value.value)),
      Field("outGoingPredicates", ListType(Triple),
        resolve = ctx => ctx.ctx.svc.triplesFromNode(ctx.value.projectId, None, ctx.value.value, None, ctx.ctx.username)),
      Field("incomingPredicates", ListType(Triple),
        resolve = ctx => ctx.ctx.svc.triplesToNode(ctx.value.projectId, None, ctx.value.value))))

  implicit val IRIInput: InputObjectType[IRI] = deriveInputObjectType[IRI](
    InputObjectTypeName("IRIInput")
  )

  val Literal: ObjectType[GraphQLContext, Literal] = ObjectType("Literal", "An RDF Literal",
    interfaces[GraphQLContext, Literal](Value),
    () => fields[GraphQLContext, Literal](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("lang", OptionType(StringType), resolve = _.value.lang),
      Field("dataType", StringType, resolve = _.value.dataType)))

  val BNode: ObjectType[GraphQLContext, BNode] = ObjectType("BNode", "An RDF BNode",
    interfaces[GraphQLContext, BNode](Value),
    () => fields[GraphQLContext, BNode](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value)))

  val Triple: ObjectType[GraphQLContext, Triple] = ObjectType("Triple", "An RDF triple",
    () => fields[GraphQLContext, Triple](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", OptionType(StringType), resolve = _.value.graph),
      Field("subj", IRI, resolve = _.value.subj),
      Field("pred", IRI, resolve = _.value.pred),
      Field("obj", Value, resolve = _.value.obj)))

  val WebPage: ObjectType[GraphQLContext, PageGet] = ObjectType("WebPage",
    () => fields[GraphQLContext, PageGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("url", StringType, resolve = _.value.url),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("content", StringType, resolve = _.value.content),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("domain", OptionType(StringType), resolve = _.value.domain)))

  val Task: ObjectType[GraphQLContext, TaskGet] = ObjectType("Task",
    () => fields[GraphQLContext, TaskGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("type", StringType, resolve = _.value.`type`),
      Field("status", StringType, resolve = _.value.status)))

  val Project: ObjectType[GraphQLContext, ProjectGet] = ObjectType("Project",
    () => fields[GraphQLContext, ProjectGet](
      Field("id", StringType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title),
      Field("repository", Repository, resolve = _.value.repository),
      Field("createdBy", StringType, resolve = _.value.createdBy),
      Field("created", LongType, resolve = _.value.created)))


  val ColorMapSettings: ObjectType[GraphQLContext, ColorMap] = ObjectType("ColorMapSettings",
    () => fields[GraphQLContext, ColorMap](
      Field("key", StringType, resolve = _.value.key),
      Field("color", StringType, resolve = _.value.color)))

  implicit val ColorMapSettingsInput: InputObjectType[ColorMap] = deriveInputObjectType[ColorMap](
    InputObjectTypeName("ColorMapSettingsInput")
  )

  val NodeRendererSettings: ObjectType[GraphQLContext, NodeRenderer] = ObjectType("NodeRendererSettings",
    () => fields[GraphQLContext, NodeRenderer](
      Field("colorMaps", ListType(ColorMapSettings), resolve = _.value.colorMaps)
    ))

  val EdgeRendererSettings: ObjectType[GraphQLContext, EdgeRenderer] = ObjectType("EdgeRendererSettings",
    () => fields[GraphQLContext, EdgeRenderer](
      Field("includePreds", ListType(IRI), resolve = _.value.includePreds),
      Field("excludePreds", ListType(IRI), resolve = _.value.excludePreds),
      Field("filterMode", StringType, resolve = _.value.filterMode.toString)
    )
  )

  val VisualGraphSettings: ObjectType[GraphQLContext, VisualGraph] = ObjectType("VisualGraphSettings",
    () => fields[GraphQLContext, VisualGraph](
      Field("nodeRenderer", NodeRendererSettings, resolve = _.value.nodeRenderer),
      Field("edgeRenderer", EdgeRendererSettings, resolve = _.value.edgeRenderer)
    ))

  implicit val EdgeFilterModeSettingsInput: EnumType[EdgeFilterMode.Value] = deriveEnumType[EdgeFilterMode.Value]()

  implicit val EdgeRendererSettingsInput: InputObjectType[EdgeRenderer] = deriveInputObjectType[EdgeRenderer](
    InputObjectTypeName("EdgeRendererSettingsInput")
  )
  implicit val NodeRendererSettingsInput: InputObjectType[NodeRenderer] = deriveInputObjectType[NodeRenderer](
    InputObjectTypeName("NodeRendererSettingsInput")
  )
  val VisualGraphSettingsInput: InputObjectType[VisualGraph] = deriveInputObjectType[VisualGraph](
    InputObjectTypeName("VisualGraphSettingsInput")
  )

  val Settings: ObjectType[GraphQLContext, SettingsGet] = ObjectType("Settings",
    () => fields[GraphQLContext, SettingsGet](
      Field("id", StringType, resolve = _.value.id),
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("username", OptionType(StringType), resolve = _.value.username),
      Field("scope", StringType, resolve = _.value.scope.toString),
      Field("visualGraph", VisualGraphSettings, resolve = _.value.visualGraph),
      Field("created", LongType, resolve = _.value.created),
      Field("modified", LongType, resolve = _.value.modified),
    ))

  val SearchHit: ObjectType[GraphQLContext, SearchHit] = ObjectType("SearchHit",
    () => fields[GraphQLContext, SearchHit](
      Field("node", IRI, resolve = _.value.node),
      Field("snippet", StringType, resolve = _.value.snippet),
      Field("score", FloatType, resolve = _.value.score)
    ))
  val Graph: ObjectType[GraphQLContext, GraphGet] = ObjectType("Graph",
    () => fields[GraphQLContext, GraphGet](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("value", StringType, resolve = _.value.value)
    ))

  val SparqlQuery: ObjectType[GraphQLContext, QueryGet] = ObjectType("SparqlQuery",
    () => fields[GraphQLContext, QueryGet](
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

  val FileInfo: ObjectType[GraphQLContext, FileInfo] = ObjectType("FileInfo",
    () => fields[GraphQLContext, FileInfo](
      Field("id", StringType, resolve = _.value.id),
      Field("filename", StringType, resolve = _.value.filename),
      Field("length", LongType, resolve = _.value.length),
      Field("contentType", OptionType(StringType), resolve = _.value.contentType),
      Field("uploadDate", OptionType(LongType), resolve = _.value.uploadDate),
      Field("uploadedBy", StringType, resolve = f => (f.value.metadata \ "uploadedBy").as[String]),
    ))

  val ProjectIdArg: Argument[String] = Argument("projectId", StringType)
  val SettingsIdArg: Argument[String] = Argument("settingsId", StringType)
  val UsernameArg: Argument[Option[String]] = Argument("username", OptionInputType(StringType))
  val GraphArg: Argument[Option[String]] = Argument("graph", OptionInputType(StringType))
  val NodeTypeArg: Argument[Option[String]] = Argument("nodeType", OptionInputType(StringType))
  val GraphsArg: Argument[Seq[String @@ FromInput.CoercedScalaResult]] = Argument("graphs", ListInputType(StringType))
  val FileIdsArg: Argument[Seq[String @@ FromInput.CoercedScalaResult]] = Argument("fileIds", ListInputType(StringType))
  val UriArg: Argument[String] = Argument("uri", StringType)
  val TermArg: Argument[String] = Argument("term", StringType)

  val VisualGraphSettingsInputArg: Argument[VisualGraph] = Argument("visualGraph", VisualGraphSettingsInput)

  val Query: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query", fields[GraphQLContext, Unit](
      Field("node", OptionType(IRI),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: Nil,
        resolve = ctx => ctx.ctx.svc.node(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg UriArg)
      ),
      Field("triplesFromNode", ListType(Triple),
        arguments = ProjectIdArg :: GraphArg :: UriArg :: NodeTypeArg :: Nil,
        resolve = ctx => ctx.ctx.svc.triplesFromNode(ctx arg ProjectIdArg, ctx arg GraphArg,
          ctx arg UriArg, ctx arg NodeTypeArg, ctx.ctx.username)
      ),
      Field("settings", Settings,
        arguments = ProjectIdArg :: UsernameArg :: Nil,
        resolve = ctx => ctx.ctx.svc.settings(ctx arg ProjectIdArg, ctx arg UsernameArg)
      ),
      Field("files", ListType(FileInfo),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.svc.files(ctx arg ProjectIdArg)
      ),
      Field("projects", ListType(Project),
        resolve = ctx => ctx.ctx.svc.projects()
      ),

      Field("graphs", ListType(Graph),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.svc.graphs(ctx arg ProjectIdArg)
      ),

      Field("crawledPages", ListType(WebPage),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.svc.crawledPages(ctx arg ProjectIdArg)
      ),

      Field("searchNodes", ListType(SearchHit),
        arguments = ProjectIdArg :: GraphArg :: TermArg :: Nil,
        resolve = ctx => ctx.ctx.svc.searchNodes(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg TermArg)
      ),
      Field("searchPreds", ListType(SearchHit),
        arguments = ProjectIdArg :: GraphArg :: TermArg :: Nil,
        resolve = ctx => ctx.ctx.svc.searchPreds(ctx arg ProjectIdArg, ctx arg GraphArg, ctx arg TermArg)
      ),
      Field("sparqlQueries", ListType(SparqlQuery),
        arguments = ProjectIdArg :: Nil,
        resolve = ctx => ctx.ctx.svc.sparqlQueries(ctx arg ProjectIdArg)
      )
    ))

  val Mutation: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Mutation", fields[GraphQLContext, Unit](
      Field("deleteGraphs", ListType(Graph),
        arguments = ProjectIdArg :: GraphsArg :: Nil,
        resolve = ctx => ctx.ctx.svc.deleteGraphs(ctx arg ProjectIdArg, ctx arg GraphsArg)
      ),
      Field("deleteFiles", ListType(FileInfo),
        arguments = ProjectIdArg :: FileIdsArg :: Nil,
        resolve = ctx => ctx.ctx.svc.deleteFiles(ctx arg ProjectIdArg, ctx arg FileIdsArg)
      ),
      Field("updateVisualGraphSettings", IntType,
        arguments = SettingsIdArg :: VisualGraphSettingsInputArg :: Nil,
        resolve = ctx => ctx.ctx.svc.updateVisualGraphSettings(ctx arg SettingsIdArg, ctx arg VisualGraphSettingsInputArg)
      )
    ))

  val schema: Schema[GraphQLContext, Unit] = Schema(Query, Some(Mutation),
    additionalTypes = NativeRepository :: VirtuosoRepository :: Literal :: BNode :: Nil)
}
