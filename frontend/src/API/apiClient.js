import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASEURL;
export const apiClient = axios.create({
  baseURL: BASE_URL,
});
