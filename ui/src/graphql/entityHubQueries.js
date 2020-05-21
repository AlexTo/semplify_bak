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
          depiction {
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
  deleteGraphs: gql`
    mutation deleteGraphs($projectId: String!, $graphs: [String!]!) {
      deleteGraphs(projectId: $projectId, graphs: $graphs) {
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
  triplesFromNode: gql`
    query triplesFromNode($projectId: String!, $graph: String, $uri: String!, $nodeType: String) {
      triplesFromNode(projectId: $projectId, graph: $graph, uri: $uri, nodeType: $nodeType) {
        subj {
          projectId
          value
          ... on IRI {
            prefLabel {
              value
            }
            depiction {
              value
            }
          }
        }
        pred {
          projectId
          value
          ... on IRI {
            prefLabel {
              value
            }
          }
        }
        obj {
          projectId
          value
          graph
          ... on IRI {
            prefLabel {
              value
            }
            depiction {
              value
            }
          }
          ... on Literal {
            dataType
            lang
          }
        }
      }
    }
  `
}
