import gql from "graphql-tag";

export const sparqlQueries = {
  queries: gql`
    query sparqlQueries($projectId: String!) {
      sparqlQueries(projectId: $projectId) {
        id
        projectId
        title
        description
        query
        createdBy
        modifiedBy
      }
    }
  `,
  deleteQueries: gql`
    mutation deleteQueries($projectId: String!, $queryIds: [String!]!) {
      deleteQueries(projectId: $projectId, queryIds: $queryIds)
    }
  `
}
