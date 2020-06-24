import gql from "graphql-tag";

export const entityHubQueries = {
  searchSubjs: gql`
    query searchSubjs($projectId: String!, $graph: String, $term: String!, $limit: Int, $offset: Int) {
      searchSubjs(projectId: $projectId, graph: $graph, term: $term, limit: $limit, offset: $offset) {
        searchHits {
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
        total
        limit
        offset
      }
    }`,
  searchPreds: gql`
    query searchPreds($projectId: String!, $graph: String, $term: String!) {
      searchPreds(projectId: $projectId, graph: $graph, term: $term) {
        searchHits {
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
        total
        limit
        offset
      }
    }`,
  searchObjs: gql`
    query searchObjs($projectId: String!, $graph: String, $term: String!, $limit: Int, $offset: Int, $subj: String!, $pred: String!) {
      searchObjs(projectId: $projectId, graph: $graph, term: $term, limit: $limit, offset: $offset, subj: $subj, pred: $pred) {
        searchHits {
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
        total
        limit
        offset
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
        projectId
        graph
        value
        prefLabel {
          value
        }
        depiction {
          value
        }
      }
    }
  `,
  triplesFromNode: gql`
    query triplesFromNode($projectId: String!, $graph: String, $subj: String!, $pred: String, $nodeType: String, $limit: Int, $offset: Int) {
      triplesFromNode(projectId: $projectId, graph: $graph, subj: $subj, pred: $pred, nodeType: $nodeType, limit: $limit, offset: $offset) {
        triples {
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
            ... on CompoundNode {
              subj
              pred
              prefLabel {
                value
              }
            }
          }
        }
        total
        limit
        offset
      }
    }
  `,
  deleteTriple: gql`
    mutation deleteTriple($projectId: String!, $graph: String!, $subj: String!, $pred: String!, $objType: String!, $objValue: String!, $dataType: String, $lang: String) {
      deleteTriple(projectId: $projectId, graph: $graph, subj: $subj, pred: $pred, objType: $objType, objValue: $objValue, dataType: $dataType, lang: $lang) {
        projectId
      }
    }
  `,
  insertTriple: gql`
    mutation insertTriple($projectId: String!, $graph: String!, $subj: String!, $pred: String!, $objType: String!, $objValue: String!, $dataType: String, $lang: String) {
      insertTriple(projectId: $projectId, graph: $graph, subj: $subj, pred: $pred, objType: $objType, objValue: $objValue, dataType: $dataType, lang: $lang) {
        projectId
      }
    }
  `,
  objsFromNode: gql`
    query triplesFromNode($projectId: String!, $graph: String, $subj: String!, $pred: String, $nodeType: String, $limit: Int, $offset: Int) {
      triplesFromNode(projectId: $projectId, graph: $graph, subj: $subj, pred: $pred, nodeType: $nodeType, limit: $limit, offset: $offset) {
        triples {
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
          }
        }
        total
        limit
        offset
      }
    }
  `
}
