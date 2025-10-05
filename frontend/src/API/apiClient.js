import axios from "axios";

export const BASE_URL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8002";
    
export const apiClient = axios.create({
//   baseURL: BASE_URL,
    baseURL: BASE_URL
});
