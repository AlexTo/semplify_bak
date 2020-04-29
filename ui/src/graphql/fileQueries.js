import gql from "graphql-tag";

export const fileQueries = {
  files: gql`
    query files($projectId: String!) {
      files(projectId: $projectId) {
        id
        filename
      }
    }
  `,
  deleteFiles: gql`
    mutation deleteFiles($projectId: String!, $fileIds: [String!]!) {
      deleteFiles(projectId: $projectId, fileIds: $fileIds) {
        id
        filename
      }
    }
  `
}
