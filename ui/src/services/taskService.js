import axios from "./axios";

const serviceUrl = '/api/tasks';

export const taskService = {
  crawl,
  importRDF
}

function crawl(projectId, seedUrl, depth) {
  return axios.post(`${serviceUrl}/`, {
    type: "webCrawler", projectId,
    params: {
      seedUrl, depth: parseInt(depth)
    }
  })
}

function importRDF(projectId, fileId, graph, baseURI, replaceGraph) {
  return axios.post(`${serviceUrl}/`, {
    type: "rdfImport", projectId,
    params: {
      fileId, graph, baseURI, replaceGraph
    }
  })
}
