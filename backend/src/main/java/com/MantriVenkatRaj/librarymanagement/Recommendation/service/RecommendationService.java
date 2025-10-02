package com.MantriVenkatRaj.librarymanagement.Recommendation.service;

import com.MantriVenkatRaj.librarymanagement.Recommendation.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate;

    @Value("${recs.api.baseurl}")
    private String baseUrl; // e.g. http://localhost:8001

    public RecommendationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RecommendationResponse getByTitle(String title, int k) {
        String url = baseUrl + "/similarByTitle?q={title}&k={k}";
        return restTemplate.getForObject(url, RecommendationResponse.class, title, k);
    }

    public RecommendationResponse getByIsbn(String isbn, int k) {
        String url = baseUrl + "/similar?isbn={isbn}&k={k}";
        return restTemplate.getForObject(url, RecommendationResponse.class, isbn, k);
    }
}
