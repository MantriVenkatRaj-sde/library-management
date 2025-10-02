package com.MantriVenkatRaj.librarymanagement.Recommendation.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private List<RecommendationItem> items;
}
