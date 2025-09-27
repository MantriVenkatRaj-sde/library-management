package com.MantriVenkatRaj.librarymanagement.user;

import com.MantriVenkatRaj.librarymanagement.Exception.BookNotFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.UserNotFoundException;
import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.book.BookRepository;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRatingRepository;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final BookOverallRatingRepository bookOverallRatingRepository;
    private final BookRepository bookRepository;

    public UserService(UserRepository userRepository, ModelMapper modelMapper, BookOverallRatingRepository bookOverallRatingRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.bookOverallRatingRepository = bookOverallRatingRepository;
        this.bookRepository = bookRepository;
    }


    public UserDTO convertToDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public List<UserDTO> AllUsersToUserDTO() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList(); // Java 16+ (or use Collectors.toList() for older Java)
    }
    public User findByUsername(String username){
        return userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    }

    public Set<BookListDTO> getReadersList(String username) {
        User user=findByUsername(username);
        Set<Book> readersList=user.getReadersList();
        return readersList.stream().map(book->{
            var avgRating=bookOverallRatingRepository.findByBook_Isbn(book.getIsbn()).get().getAvgRating();
            var ratingCount=bookOverallRatingRepository.findByBook_Isbn(book.getIsbn()).get().getRatingCount();
            return BookListDTO.builder()
                    .id(book.getId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .imageLink(book.getBookMedia().getImageLink())
                    .avgRating(avgRating)
                    .ratingCount(ratingCount)
                    .isbn(book.getIsbn())
                    .build();
            }).collect(Collectors.toSet());
    }

    @Transactional
    public ResponseEntity<String> likeBook(String username, String isbn) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        user.getReadersLikedBooks().add(book);
        return ResponseEntity.ok("Added to Liked Books");
    }

    @Transactional
    public ResponseEntity<String> unlikeBook(String username, String isbn) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        user.getReadersLikedBooks().remove(book);
        return ResponseEntity.ok("Removed from Liked Books");
    }

    @Transactional
    public ResponseEntity<Set<BookListDTO>> getLikedBooks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        Set<BookListDTO> likedBooks = user.getReadersLikedBooks().stream()
                .map(book -> {
                    var overallOpt = bookOverallRatingRepository.findByBook_Isbn(book.getIsbn());
                    double avgRating = overallOpt.map(BookOverallRating::getAvgRating).orElse(0.0);
                    long ratingCount = overallOpt.map(BookOverallRating::getRatingCount).orElse(0L);

                    return BookListDTO.builder()
                            .id(book.getId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .imageLink(book.getBookMedia().getImageLink())
                            .avgRating(avgRating)
                            .ratingCount(ratingCount)
                            .isbn(book.getIsbn())
                            .build();
                })
                .collect(Collectors.toSet());

        return ResponseEntity.ok(likedBooks);
    }

    public UserDTO getUser(String username) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .age(user.getAge())
                .phone(user.getPhone())
                .email(user.getEmail())
                .build();
    }

    public Boolean isLiked(String username, String isbn) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        return user.getReadersLikedBooks().contains(book);
    }
    public Boolean isSaved(String username, String isbn) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        return user.getReadersList().contains(book);
    }
}

