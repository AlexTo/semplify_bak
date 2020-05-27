import gql from "graphql-tag";

export const projectQueries = {
  projects: gql`
    query {
      projects {
        id
        title
        repository {
          type
          ... on VirtuosoRepository {
            hostList
          }
        }
        createdBy
        created
      }
    }
  `
}
