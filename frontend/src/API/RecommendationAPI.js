import { apiClient } from "./apiClient";

export async function ContentBasedRecommendationByIsbn(isbn, k) {
  return await apiClient.get(`/api/recommend/isbn`, {
    params: { isbn: isbn, k: k }
  });
}
  export async function ContentBasedRecommendationByTitle(title, k) {
  return await apiClient.get(`/api/recommend/title`, {
    params: { q: title, k: k }
  });
}

