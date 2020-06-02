import gql from "graphql-tag";

export const settingsQueries = {
  visualGraph: gql`
    query settings($projectId: String!, $username: String) {
      settings(projectId: $projectId, username: $username) {
        id
        visualGraph {
          edgeRenderer {
            includePreds {
              value
              prefLabel {
                value
              }
            }
            excludePreds {
              value
              prefLabel {
                value
              }
            }
            filterMode
          }
          nodeRenderer {
            colorMaps {
              key
              color
            }
          }
        }
      }
    }
  `
}
