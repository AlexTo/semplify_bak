import axios from "./axios";
import {handleResponse} from "../helpers/handleResponse";

export const fileService = {
  upload
}

const serviceUrl = '/api/files';

async function upload(projectId, file, type) {
  const formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("type", type);
  formData.append("file", file);
  return axios.post(`${serviceUrl}/`, formData)
    .then(handleResponse);
}
