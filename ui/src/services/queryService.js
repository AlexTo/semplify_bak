import axios from "./axios";
import {handleResponse} from "../helpers/handleResponse";

export const queryService = {
  create
}

const serviceUrl = '/api/queries'

function create(projectId, label, description, query) {
  return axios.post(`${serviceUrl}/`, {
    projectId, label, description, query
  }).then(handleResponse);
}
