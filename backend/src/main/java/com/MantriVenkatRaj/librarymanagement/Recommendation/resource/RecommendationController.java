package com.MantriVenkatRaj.librarymanagement.Recommendation.resource;

import com.MantriVenkatRaj.librarymanagement.Recommendation.dto.RecommendationResponse;
import com.MantriVenkatRaj.librarymanagement.Recommendation.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/title")
    public RecommendationResponse recommendByTitle(@RequestParam String q,
                                                   @RequestParam(defaultValue = "10") int k) {
        return recommendationService.getByTitle(q, k);
    }

    @GetMapping("/isbn")
    public RecommendationResponse recommendByIsbn(@RequestParam String isbn,
                                                  @RequestParam(defaultValue = "10") int k) {
        return recommendationService.getByIsbn(isbn, k);
    }
}
