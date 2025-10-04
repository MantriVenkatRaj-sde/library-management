import React from "react";

export default function StarRating({ rating }) {
    // Tempoprary rating if books ratings are 0
    return (
        <>
        {Array.from({ length: 10 }, (_, i) => {
            const starValue = i + 1;
            if (rating >= starValue) {
            return <i key={i} className="bi bi-star-fill text-warning"></i>;
            } else if (rating >= starValue - 0.5) {
            return <i key={i} className="bi bi-star-half text-warning"></i>;
            } else {
            return <i key={i} className="bi bi-star text-warning"></i>;
            }
        })}
        <span className="text-light ms-2">{Math.ceil(rating * 10) / 10}/10</span>
        </>
    );
}
