import gql from "graphql-tag";

export const fileQueries = {
  files: gql`
    query files($projectId: String!) {
      files(projectId: $projectId) {
        id
        filename
      }
    }
  `
}
