import axios from "./axios";
import {handleResponse} from "../helpers/handleResponse";

export const queryService = {
  create,
  update
}

const serviceUrl = '/api/queries'

function create(projectId, title, description, query) {
  return axios.post(`${serviceUrl}/`, {
    projectId, title, description, query
  }).then(handleResponse);
}


function update(id, projectId, title, description, query) {
  return axios.put(`${serviceUrl}/`, {
    id, projectId, title, description, query
  }).then(handleResponse);
}
