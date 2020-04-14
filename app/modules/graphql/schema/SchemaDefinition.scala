package modules.graphql.schema

import modules.entityhub.models.{Edge, Node, SearchHit}
import modules.graphql.services.Repository
import modules.project.models.ProjectGet
import sangria.schema._

object SchemaDefinition {

  val Edge: ObjectType[Repository, Edge] = ObjectType("Edge", "A graph edge",
    () => fields[Repository, Edge](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", StringType, resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("from", Node, resolve = _.value.from),
      Field("to", Node, resolve = _.value.to),
    ))

  val Node: ObjectType[Repository, Node] = ObjectType("Node", "A graph node",
    () => fields[Repository, Node](
      Field("projectId", StringType, resolve = _.value.projectId),
      Field("graph", StringType, resolve = _.value.graph),
      Field("value", StringType, resolve = _.value.value),
      Field("type", StringType, resolve = _.value._type),
      Field("lang", OptionType(StringType), resolve = _.value.lang),
      Field("dataType", OptionType(StringType), resolve = _.value.dataType),
      Field("outGoingEdges", ListType(Edge),
        resolve = ctx => ctx.ctx.edgesFromNode(ctx.value.projectId, ctx.value.graph, ctx.value.value)),
      Field("incomingEdges", ListType(Edge),
        resolve = ctx => ctx.ctx.edgesToNode(ctx.value.projectId, ctx.value.graph, ctx.value.value))
    ))

  val Project: ObjectType[Repository, ProjectGet] = ObjectType("Project",
    () => fields[Repository, ProjectGet](
      Field("id", StringType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title)
    ))

  val SearchHit: ObjectType[Repository, SearchHit] = ObjectType("SearchHit",
    () => fields[Repository, SearchHit](
      Field("node", Node, resolve = _.value.node),
      Field("snippet", StringType, resolve = _.value.snippet),
      Field("score", FloatType, resolve = _.value.score)
    )
  )

  val ProjectId: Argument[String] = Argument("projectId", StringType)
  val Graph: Argument[String] = Argument("graph", StringType)
  val Uri: Argument[String] = Argument("uri", StringType)
  val Term: Argument[String] = Argument("term", StringType)

  val Query: ObjectType[Repository, Unit] = ObjectType(
    "Query", fields[Repository, Unit](
      Field("node", OptionType(Node),
        arguments = ProjectId :: Graph :: Uri :: Nil,
        resolve = ctx => ctx.ctx.node(ctx arg ProjectId, ctx arg Graph, ctx arg Uri)
      ),
      Field("projects", ListType(Project),
        resolve = ctx => ctx.ctx.projects()
      ),
      Field("searchNodes", ListType(SearchHit),
        arguments = ProjectId :: Term :: Nil,
        resolve = ctx => ctx.ctx.searchNodes(ctx arg ProjectId, ctx arg Term)
      )
    ))

  val schema: Schema[Repository, Unit] = Schema(Query)
}
