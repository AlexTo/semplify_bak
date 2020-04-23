import axios from 'axios';
import keycloak from "./keycloak";

axios.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

export default axios.create();

