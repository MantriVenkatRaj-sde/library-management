import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;
export const apiClient = axios.create({
  baseURL: BASE_URL,
});
