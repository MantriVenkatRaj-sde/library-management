package com.MantriVenkatRaj.librarymanagement.book.bookoverallrating;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookOverallRatingService {
    private final BookOverallRatingRepository bookRatingRepository;
    private final ModelMapper modelMapper;

    public BookOverallRatingService(BookOverallRatingRepository bookRatingRepository, ModelMapper modelMapper) {
        this.bookRatingRepository = bookRatingRepository;
        this.modelMapper = modelMapper;
    }

    public BookOverallRatingDTO convertToBookRatingDTO(BookOverallRating bookRating) {
        return modelMapper.map(bookRating, BookOverallRatingDTO.class);
    }

    public List<BookOverallRatingDTO> getBooksOverallRatings() {
        return bookRatingRepository.findAll().stream().map(this::convertToBookRatingDTO).toList();
    }
}
