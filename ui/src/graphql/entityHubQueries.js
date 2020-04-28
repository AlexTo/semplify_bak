import gql from "graphql-tag";

export const entityHubQueries = {
  searchNodes: gql`
    query searchNodes($projectId: String!, $graph: String, $term: String!) {
      searchNodes(projectId: $projectId, graph: $graph, term: $term) {
        node {
          projectId
          value
          graph
          prefLabel {
            value
          }
        }
        snippet
      }
    }`,
  graphs: gql`
    query graphs($projectId: String!) {
      graphs(projectId: $projectId) {
        value
      }
    }
  `,
  node: gql`
    query node($projectId: String!, $graph: String, $uri: String!) {
      node(projectId: $projectId, graph: $graph, uri: $uri) {
        value
        prefLabel {
          value
        }
      }
    }
  `,
  predicatesFromNode: gql`
    query predicatesFromNode($projectId: String!, $graph: String, $uri: String!) {
      predicatesFromNode(projectId: $projectId, graph: $graph, uri: $uri) {
        value
        prefLabel {
          value
        }
        from {
          value
        }
        to {
          projectId
          value
          graph
          ... on IRI {
            prefLabel {
              value
            }
          }
        }
      }
    }
  `
}
