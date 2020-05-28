package modules.graphql.models

import modules.graphql.services.GraphQLService

case class GraphQLContext(svc: GraphQLService, username: String)
