package com.MantriVenkatRaj.librarymanagement.rating;

import com.MantriVenkatRaj.librarymanagement.Exception.BookNotFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.NoExistingRatingFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.UserNotFoundException;
import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.book.BookRepository;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRatingRepository;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import com.MantriVenkatRaj.librarymanagement.rating.dto.RatingRequest;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingsService {
    private final ModelMapper modelMapper;
    private final RatingsRepository ratingsRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookOverallRatingRepository bookOverallRatingRepository;

    public RatingsService(ModelMapper modelMapper, RatingsRepository ratingsRepository, UserRepository userRepository, BookRepository bookRepository, BookOverallRatingRepository bookOverallRatingRepository) {
        this.modelMapper = modelMapper;
        this.ratingsRepository = ratingsRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;

        this.bookOverallRatingRepository = bookOverallRatingRepository;
    }

    @Transactional
    public BookRatingDTO convertToRatingsDTO(Rating rating) {
        BookRatingDTO dto = modelMapper.map(rating, BookRatingDTO.class);

        if (rating.getUser() != null) {
            dto.setUserId(rating.getUser().getId());
            dto.setUsername(rating.getUser().getUsername());
        }

        if (rating.getBook() != null) {
            dto.setBookId(rating.getBook().getId());
            dto.setBookIsbn(rating.getBook().getIsbn());
            dto.setBookTitle(rating.getBook().getTitle());
        }
        return dto;
    }

    //To return a particular rating of a user on a book
    @Transactional
    public BookRatingDTO getParticularRatingsOfABookByUser(String username, String isbn){
        Long userId = ratingsRepository.findByUser_Username(username)
                .map(User::getId)
                .orElseThrow(UserNotFoundException::new);

        Rating ratingOfBookByUser=ratingsRepository.findByUser_IdAndBook_Isbn(userId,isbn)
                .orElseThrow(NoExistingRatingFoundException::new);
        return convertToRatingsDTO(ratingOfBookByUser);
    }

    //To return all the Ratings of a book by a User
    @Transactional
    public List<BookRatingDTO> getRatingsByUser(String username){
        User user=ratingsRepository.findByUser_Username(username).orElseThrow(UserNotFoundException::new);
        return user.getRatings().stream()
                .map(this::convertToRatingsDTO)
                .toList();
    }

    @Transactional
    public List<BookRatingDTO> getRatingsOfaBook(String bookIsbn) {
        Book book=ratingsRepository.findByBook_Isbn(bookIsbn).orElseThrow(BookNotFoundException::new);
        return book.getRatings().stream()
                .map(this::convertToRatingsDTO)
                .toList();
    }

    public List<BookRatingDTO> getAllRatings() {
        return ratingsRepository.findAll().stream().map(this::convertToRatingsDTO).toList();
    }

    //Add a rating given by a user
    @Transactional
    public void RateABook(String isbn, String username, RatingRequest ratingRequest) {
        Book book = bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Rating rating = Rating.builder()
                .user(user)
                .book(book)
                .rating(ratingRequest.getRating())
                .review(ratingRequest.getReview())
                .build();
        ratingsRepository.save(rating);

        BookOverallRating overall = bookOverallRatingRepository.findByBookIsbnForUpdate(isbn)
                .orElseGet(() -> {
                    // create initial row when missing (avg 0, count 0)
                    BookOverallRating newOverall = BookOverallRating.builder()
                            .book(book)
                            .avgRating(0.0)
                            .ratingCount(0L)
                            .build();
                    return bookOverallRatingRepository.save(newOverall);
                });

        long oldCount = (overall.getRatingCount() == 0) ? 0L : overall.getRatingCount();
        double oldAvg = overall.getAvgRating() == 0.0 ? 0.0 : overall.getAvgRating();

        long newCount = oldCount + 1;
        double newAvg = (oldAvg * oldCount + ratingRequest.getRating()) / (double) newCount;

        overall.setRatingCount(newCount);
        overall.setAvgRating(newAvg);

        bookOverallRatingRepository.save(overall);
    }

    @Transactional
    public void UpdateTheRatingOfTheBook(String isbn,
                                         String username,
                                         RatingRequest ratingRequest) {

        Rating existing=ratingsRepository.findByUser_UsernameAndBook_Isbn(username,isbn)
                .orElseThrow(NoExistingRatingFoundException::new);

        double oldValue = existing.getRating();
        existing.setRating(ratingRequest.getRating());
        String oldReview= existing.getReview();
        existing.setReview(oldReview);
        ratingsRepository.save(existing);

        BookOverallRating overall = bookOverallRatingRepository.findByBookIsbnForUpdate(isbn)
                .orElseThrow(() -> new IllegalStateException("BookOverallRating missing"));

        long count = overall.getRatingCount();
        if (count <= 0) {
            // unexpected, but recover by setting this as single rating
            overall.setRatingCount(1L);
            overall.setAvgRating(ratingRequest.getRating());
        } else {
            double newAvg = (overall.getAvgRating() * count - oldValue + ratingRequest.getRating()) / (double) count;
            overall.setAvgRating(newAvg);
        }

        bookOverallRatingRepository.save(overall);

    }
    @Transactional
    public void DeleteTheRatingOfTheBook(String isbn, String username, Long  ratingId) {
        Rating existing=ratingsRepository.findByIdAndUser_UsernameAndBook_Isbn(ratingId,username,isbn)
                .orElseThrow(NoExistingRatingFoundException::new);

        BookOverallRating overall=bookOverallRatingRepository.findByBookIsbnForUpdate(isbn)
                .orElseThrow(() -> new IllegalStateException("BookOverallRating missing"));
        overall.setRatingCount(overall.getRatingCount()-1);

        long oldCount = overall.getRatingCount();
        if (oldCount <= 1) {
            overall.setRatingCount(0L);
            overall.setAvgRating(0.0);
        } else {
            long newCount = oldCount - 1;
            double newAvg = (overall.getAvgRating() * oldCount - existing.getRating()) / (double) newCount;
            overall.setRatingCount(newCount);
            overall.setAvgRating(newAvg);
        }
        ratingsRepository.delete(existing);
        bookOverallRatingRepository.save(overall);
    }
}
