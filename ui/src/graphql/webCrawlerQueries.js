import gql from "graphql-tag";

export const webCrawlerQueries = {
  crawledPages: gql`
    query crawledPages($projectId: String!) {
      crawledPages(projectId: $projectId) {
        id
        url
        title
        domain
      }
    }
  `
}
