import gql from "graphql-tag";

export const settingsQueries = {
  updateVisualGraph: gql`
    mutation updateVisualGraphSettings($settingsId: String!, $visualGraph: VisualGraphSettingsInput!) {
      updateVisualGraphSettings(settingsId: $settingsId, visualGraph: $visualGraph)
    }
  `,
  visualGraph: gql`
    query settings($projectId: String!, $username: String) {
      settings(projectId: $projectId, username: $username) {
        id
        visualGraph {
          edgeRenderer {
            includePreds {
              value
              projectId
              prefLabel {
                value
              }
            }
            excludePreds {
              value
              projectId
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
