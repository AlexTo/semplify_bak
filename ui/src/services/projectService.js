import axios from "./axios";
import {handleResponse} from "../helpers/handleResponse";

export const projectService = {
  create
}

const serviceUrl = '/api/projects'


function create(title, repositoryType, hostList, username, password) {
  return axios.post(`${serviceUrl}/`, {
    title, repository: repositoryType === "Native" ? {
      type: repositoryType
    } : {type: repositoryType, hostList, username, password, defGraph: "sesame:nil"}
  }).then(handleResponse);
}
