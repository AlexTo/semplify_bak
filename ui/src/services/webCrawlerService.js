import axios from "./axios";

const serviceUrl = '/api/tasks/';
const taskType = "webCrawler";


export const webCrawlerService = {
  crawl
}

function crawl(projectId, seedUrl, depth) {
  return axios.post(`${serviceUrl}/`, {
    type: taskType, projectId, params: {seedUrl, depth: parseInt(depth)}
  })
}
