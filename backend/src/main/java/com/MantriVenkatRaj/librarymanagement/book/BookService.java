package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.Exception.BookNotFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.GenreNotFoundException;
import com.MantriVenkatRaj.librarymanagement.book.bookmedia.BookMedia;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookComponentDTO;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookMapper;
import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import com.MantriVenkatRaj.librarymanagement.genre.GenreRepository;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import jakarta.validation.Valid;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.Reader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final BookMapper bookMapper;

    public BookService(BookRepository bookRepository, GenreRepository genreRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.genreRepository = genreRepository;
        this.bookMapper = bookMapper;
    }

    public void loadCSV() throws Exception {
        try (Reader reader = new FileReader("D:/Library Management System/LibraryData/AllBooks.csv")) {
            CSVFormat format = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreEmptyLines()
                    .withTrim();

            Iterable<CSVRecord> records = format.parse(reader);


            for (CSVRecord record : records) {
                String title = record.get("title");
                String series = record.get("series");
                String author = record.get("author");
                String description = record.get("description");
                String isbn = record.get("isbn");
                String imageLink = record.get("coverImg");
                String publisher = record.get("publisher");
                String publishDate = record.get("publishDate");
                String publishedYear = publishDate.split(" ")[publishDate.split(" ").length - 1];
                String language = record.get("language");

                int numOfPages = Integer.parseInt(record.get("pages"));
                long numOfRatings = Integer.parseInt(record.get("numRatings"));
                float rating = Float.parseFloat(record.get("rating"));
                float likePercent = Float.parseFloat(record.get("likedPercent"));
                float price = record.isMapped("price") && !record.get("price").isBlank()
                        ? (int) Float.parseFloat(record.get("price"))
                        : 0;
                // Skip if critical fields are empty
                if (title.isEmpty() || author.isEmpty() || description.isEmpty() || isbn.isEmpty()) {
                    System.out.println("Skipping row due to missing critical data: " + record);
                    continue; // Skip this row
                }

// Handle genres
                String[] genres = record.get("genres").split(";");
                Set<Genre> genreSet = new HashSet<>();
                for (String gName : genres) {
                    String cleaned = gName.trim().toLowerCase();
                    if (cleaned.isEmpty()) continue;

                    Genre genre = genreRepository.findByName(cleaned)
                            .orElseGet(() -> {
                                Genre newGenre = new Genre();
                                newGenre.setName(cleaned);
                                return genreRepository.save(newGenre);
                            });
                    genreSet.add(genre);
                }

// Build Book
                Book book = new Book();
                book.setTitle(title);
                book.setAuthor(author);
                book.setIsbn(isbn);
                book.setDescription(description);
                book.setLanguage(language);
                book.setNumOfPages(numOfPages);
                book.setSeries(series);
                book.setGenres(genreSet);

// Build BookMedia
                BookMedia bookMedia = new BookMedia();
                bookMedia.setBook(book);
                bookMedia.setImageLink(imageLink);
                bookMedia.setPublisher(publisher);
                bookMedia.setPublishedYear(publishedYear);
                bookMedia.setPrice(price);
                bookMedia.setNumOfRatings(numOfRatings);
                bookMedia.setLikePercent(likePercent);
                bookMedia.setRating(rating);

                book.setBookMedia(bookMedia);

                BookOverallRating bookOverallRating = BookOverallRating.builder()
                        .book(book).
                        avgRating(0.0d)
                        .ratingCount(0L)
                        .build();
                book.setBookOverallRating(bookOverallRating);


                bookRepository.save(book);
            }
        }
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            loadCSV();
        }
    }


    public BookComponentDTO findBookByIsbn(String isbn) {
        Book b = bookRepository.findIsbnBookWithMediaAndRating(isbn)
                .orElseThrow(BookNotFoundException::new);

        return BookComponentDTO.builder()
                .id(b.getId())
                .isbn(b.getIsbn())
                .title(b.getTitle())
                .imageLink(b.getBookMedia() != null ? b.getBookMedia().getImageLink() : null)
                .author(b.getAuthor())
                .likePercent(b.getBookMedia() != null ? b.getBookMedia().getLikePercent() : null)
                .avgRating(b.getBookOverallRating() != null ? b.getBookOverallRating().getAvgRating() : null)
                .ratingCount(b.getBookMedia() != null ? b.getBookMedia().getNumOfRatings() : null)
                .description(b.getDescription())
                .publisher(b.getBookMedia() != null ? b.getBookMedia().getPublisher() : null)
                .publishedYear(b.getBookMedia() != null ? b.getBookMedia().getPublishedYear() : null)
                .genres(b.getGenres().stream().map(genre -> genre.getName()).collect(Collectors.toSet()))
                .build();
    }


    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    public List<BookListDTO> getAllBooksHomePageDTO() {
        List<Book> books = bookRepository.findAllWithMediaAndRating();
        return books.stream().map(b -> {
            BookListDTO d = BookListDTO.builder()
                    .id(b.getId())
                    .title(b.getTitle())
                    .author(b.getAuthor())
                    .isbn(b.getIsbn())
                    .imageLink(b.getBookMedia().getImageLink())
                    .ratingCount(b.getBookOverallRating().getRatingCount())
                    .avgRating(b.getBookOverallRating().getAvgRating())
                    .build();
            return d;
        }).collect(Collectors.toList());
    }

    public void addNewBookToLibrary(@Valid BookComponentDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        bookRepository.save(book);
    }

    public List<BookListDTO> findBooksByGenres(String genreTag) {
        Genre genre=genreRepository.findByName(genreTag).orElseThrow(GenreNotFoundException::new);
//        List<BookListDTO> bookListDTOS=bookRepository.findBooksByGenreId(genre.getId()).stream()
//                .map(b -> {
//                    BookListDTO d = BookListDTO.builder()
//                            .id(b.getId())
//                            .title(b.getTitle())
//                            .author(b.getAuthor())
//                            .isbn(b.getIsbn())
//                            .imageLink(b.getBookMedia().getImageLink())
//                            .ratingCount(b.getBookOverallRating().getRatingCount())
//                            .avgRating(b.getBookOverallRating().getAvgRating())
//                            .build();
//                    return d;
//                }).toList();
        return bookRepository.findBookListDTOsByGenreId(genre.getId());
    }

    public List<BookListDTO> searchQuery(String q) {
        if (q == null) {
            return Collections.emptyList();
        }

        String term = q.trim();
        if (term.isEmpty()) return Collections.emptyList();

        // safety limit
        if (term.length() > 200) term = term.substring(0, 200);

        // escape SQL LIKE wildcards: backslash first, then % and _
        String escaped = term.replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_");

        String normalized = escaped.toLowerCase(Locale.ROOT);
        String pattern = "%" + normalized + "%";

        // fetch author matches first
        List<BookListDTO> authorMatches = bookRepository.findBooksByAuthorLike(pattern);
        if (authorMatches == null) authorMatches = Collections.emptyList();

        // fetch title matches
        List<BookListDTO> titleMatches = bookRepository.findBooksByTitleLike(pattern);
        if (titleMatches == null) titleMatches = Collections.emptyList();

        // Merge while preserving order: authorMatches first, then titleMatches that aren't already included.
        // Use LinkedHashMap keyed by id to preserve insertion order and dedupe.
        Map<Long, BookListDTO> merged = new LinkedHashMap<>();

        for (BookListDTO b : authorMatches) {
            if (b != null && b.getId() != null) merged.put(b.getId(), b);
        }
        for (BookListDTO b : titleMatches) {
            if (b != null && b.getId() != null) merged.putIfAbsent(b.getId(), b);
        }

        return new ArrayList<>(merged.values());
    }

    public List<BookRatingDTO> getRatings(String isbn) {
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        return book.getRatings().stream().map(rating -> {
            var user=rating.getUser();
            return BookRatingDTO.builder()
                    .id(rating.getId())
                    .bookId(rating.getBookId())
                    .bookIsbn(book.getIsbn())
                    .bookTitle(book.getTitle())
                    .rating(rating.getRating())
                    .review(rating.getReview())
                    .username(user.getUsername())
                    .userId(user.getId())
                    .updatedAt(rating.getUpdatedAt())
                    .createdAt(rating.getCreatedAt())
                    .build();
            }
        ).toList();
    }

//    private Long id;
//
//    private Integer rating;
//    private String review;
//    private Instant createdAt;
//    private Instant updatedAt;
//
//    private Long userId;
//    private String username;
//    private Long bookId;
//    private String bookIsbn;
//    private String bookTitle;
}

//    public List<Book> findByAuthorContainingIgnoreCase(String author) {
//        return bookRepository.findByAuthorContainingIgnoreCase(author);
//    }
//
//    public List<Book> findByTitleContainingIgnoreCase(String title) {
//        return bookRepository.findByTitleContainingIgnoreCase(title);
//    }
//
//    public List<Book> findByGenreName(String genre) {
//        return bookRepository.findByGenreName(genre);
//    }

