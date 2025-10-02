package com.MantriVenkatRaj.librarymanagement.Recommendation.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationItem {
    private String isbn;
    private double score;
    private String title;
    private String imageLink;
}