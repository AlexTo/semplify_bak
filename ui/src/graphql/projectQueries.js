import gql from "graphql-tag";

export const projectQueries = {
  projects: gql`
    query {
      projects {
        id
        title
      }
    }
  `
}
