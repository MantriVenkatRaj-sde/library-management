import axios from "axios";

export const BASE_URL = process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com" // deployed backend URL
    : "http://localhost:8002"; // local Spring Boot backend
export const apiClient = axios.create({
//   baseURL: BASE_URL,
    baseURL: BASE_URL
});
