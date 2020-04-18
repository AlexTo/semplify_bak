package modules.graphql.schema

import modules.entityhub.models.{BNode, IRI, Literal, Predicate, SearchHit}
import modules.graphql.services.Repository
import modules.project.models.ProjectGet
import sangria.schema._

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

  val ProjectId: Argument[String] = Argument("projectId", StringType)
  val Graph: Argument[Option[String]] = Argument("graph", OptionInputType(StringType))

  val Uri: Argument[String] = Argument("uri", StringType)
  val Term: Argument[String] = Argument("term", StringType)

  val Query: ObjectType[Repository, Unit] = ObjectType(
    "Query", fields[Repository, Unit](
      Field("node", OptionType(IRI),
        arguments = ProjectId :: Graph :: Uri :: Nil,
        resolve = ctx => ctx.ctx.node(ctx arg ProjectId, ctx arg Graph, ctx arg Uri)
      ),
      Field("predicatesFromNode", ListType(Predicate),
        arguments = ProjectId :: Graph :: Uri :: Nil,
        resolve = ctx => ctx.ctx.predicatesFromNode(ctx arg ProjectId, ctx arg Graph, ctx arg Uri)
      ),
      Field("projects", ListType(Project),
        resolve = ctx => ctx.ctx.projects()
      ),
      Field("searchNodes", ListType(SearchHit),
        arguments = ProjectId :: Graph :: Term :: Nil,
        resolve = ctx => ctx.ctx.searchNodes(ctx arg ProjectId, ctx arg Graph, ctx arg Term)
      )
    ))

  val schema: Schema[Repository, Unit] = Schema(Query, additionalTypes = Literal :: BNode :: Nil)
}
