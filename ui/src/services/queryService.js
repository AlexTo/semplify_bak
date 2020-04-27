import axios from "./axios";
import {handleResponse} from "../helpers/handleResponse";

export const queryService = {
  create,
  update
}

const serviceUrl = '/api/queries'

function create(projectId, label, description, query) {
  return axios.post(`${serviceUrl}/`, {
    projectId, label, description, query
  }).then(handleResponse);
}


function update(id, projectId, label, description, query) {
  return axios.put(`${serviceUrl}/`, {
    id, projectId, label, description, query
  }).then(handleResponse);
}
