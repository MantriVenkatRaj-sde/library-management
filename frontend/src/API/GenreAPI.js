import { apiClient } from "./apiClient";

export function getAllGenres(){
    return apiClient.get(`/genres`);
}