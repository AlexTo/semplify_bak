import gql from "graphql-tag";

export const entityHubQueries = {
  searchNodes: gql`
    query searchNodes($projectId: String!, $term: String!) {
      searchNodes(projectId: $projectId, term: $term) {
        node {
          value
          prefLabel {
            value
          }
        }
        snippet
      }
    }`
}
