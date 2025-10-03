package com.MantriVenkatRaj.librarymanagement.book;

import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.nio.charset.StandardCharsets;

import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
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
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.Reader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService implements CommandLineRunner {

    private static final Path CHECKPOINT_FILE = Path.of("D:/Library Management System/LibraryData/last_processed.txt");
    private static final int CHECKPOINT_FLUSH_EVERY = 50; // flush to disk every 50 records
    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final BookMapper bookMapper;

    public BookService(BookRepository bookRepository, GenreRepository genreRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.genreRepository = genreRepository;
        this.bookMapper = bookMapper;
    }

    private long readLastCheckpoint() {
        try {
            if (Files.exists(CHECKPOINT_FILE)) {
                String s = Files.readString(CHECKPOINT_FILE, StandardCharsets.UTF_8).trim();
                if (!s.isBlank()) {
                    return Long.parseLong(s);
                }
            }
        } catch (Exception e) {
            // log and ignore — treat as no checkpoint
            System.err.println("Unable to read checkpoint, starting from beginning: " + e.getMessage());
        }
        return 0L;
    }

    private void writeLastCheckpoint(long recordNumber) {
        try {
            Path tmp = CHECKPOINT_FILE.resolveSibling(CHECKPOINT_FILE.getFileName() + ".tmp");
            Files.writeString(tmp, Long.toString(recordNumber), StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.move(tmp, CHECKPOINT_FILE, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (Exception e) {
            // log but don't crash the whole process
            System.err.println("Unable to write checkpoint: " + e.getMessage());
        }
    }

    public void loadCSV() throws Exception {
        long lastProcessed = readLastCheckpoint();
        System.out.println("Starting CSV load from record > " + lastProcessed);

        Path csvPath = Path.of("D:/Library Management System/LibraryData/AllBooks.csv");
        Path failedPath = Path.of("D:/Library Management System/LibraryData/failed_records.csv");

        // Prepare failed CSV writer (append if exists)
        try (BufferedWriter failedWriter = Files.newBufferedWriter(failedPath, StandardCharsets.UTF_8,
                java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
             Reader reader = new FileReader(csvPath.toFile())) {

            CSVPrinter failedPrinter = new CSVPrinter(failedWriter, CSVFormat.DEFAULT);

            CSVFormat format = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreEmptyLines()
                    .withTrim();

            Iterable<CSVRecord> records = format.parse(reader);

            long processedSinceFlush = 0L;

            for (CSVRecord record : records) {
                long recordNumber = record.getRecordNumber(); // 1-based with header excluded
                if (recordNumber <= lastProcessed) {
                    continue; // already processed
                }

                try {
                    // --- Basic validation & parsing (defensive) ---
                    String title = record.isMapped("title") ? record.get("title").trim() : "";
                    String author = record.isMapped("author") ? record.get("author").trim() : "";
                    String description = record.isMapped("description") ? record.get("description").trim() : "";
                    String isbnRaw = record.isMapped("isbn") ? record.get("isbn").trim() : "";
                    String isbn = isbnRaw.replaceAll("[-\\s]", ""); // normalize

                    if (title.isEmpty() || author.isEmpty() || description.isEmpty() || isbn.isEmpty()) {
                        String reason = "Missing critical field(s)";
                        System.out.println("Skipping row due to missing critical data at record " + recordNumber + " -> " + reason);
                        failedPrinter.printRecord(recordNumber, isbnRaw, title, reason);
                        failedPrinter.flush();

                        lastProcessed = recordNumber;
                        processedSinceFlush++;
                        if (processedSinceFlush >= CHECKPOINT_FLUSH_EVERY) {
                            writeLastCheckpoint(lastProcessed);
                            processedSinceFlush = 0;
                        }
                        continue;
                    }

                    // Skip if already in DB (prevents duplicates)
                    if (bookRepository.existsByIsbn(isbn) || bookRepository.existsByIsbn(isbnRaw)) {
                        System.out.println("Skipping already existing ISBN: " + isbn + " at record " + recordNumber);
                        lastProcessed = recordNumber;
                        processedSinceFlush++;
                        if (processedSinceFlush >= CHECKPOINT_FLUSH_EVERY) {
                            writeLastCheckpoint(lastProcessed);
                            processedSinceFlush = 0;
                        }
                        continue;
                    }

                    // robust numeric parsing helpers (remove non-digits)
                    int numOfPages = 0;
                    try {
                        String pagesRaw = record.isMapped("pages") ? record.get("pages").trim() : "";
                        pagesRaw = pagesRaw.replaceAll("[^0-9]", "");
                        if (!pagesRaw.isBlank()) numOfPages = Integer.parseInt(pagesRaw);
                    } catch (Exception e) {
                        numOfPages = 0;
                    }

                    long numOfRatings = 0;
                    try {
                        String nr = record.isMapped("numRatings") ? record.get("numRatings").trim().replaceAll("[^0-9]", "") : "";
                        if (!nr.isBlank()) numOfRatings = Long.parseLong(nr);
                    } catch (Exception e) {
                        numOfRatings = 0;
                    }

                    float rating = 0f;
                    try {
                        String r = record.isMapped("rating") ? record.get("rating").trim().replaceAll("[^0-9.]", "") : "";
                        if (!r.isBlank()) rating = Float.parseFloat(r);
                    } catch (Exception e) {
                        rating = 0f;
                    }

                    float likePercent = 0f;
                    try {
                        String lp = record.isMapped("likedPercent") ? record.get("likedPercent").trim().replaceAll("[^0-9.]", "") : "";
                        if (!lp.isBlank()) likePercent = Float.parseFloat(lp);
                    } catch (Exception e) {
                        likePercent = 0f;
                    }

                    float price = 0f;
                    try {
                        if (record.isMapped("price") && !record.get("price").isBlank()) {
                            String p = record.get("price").trim().replaceAll("[^0-9.]", "");
                            if (!p.isBlank()) price = Float.parseFloat(p);
                        }
                    } catch (Exception e) {
                        price = 0f;
                    }

                    String imageLink = record.isMapped("coverImg") ? record.get("coverImg").trim() : null;
                    String publisher = record.isMapped("publisher") ? record.get("publisher").trim() : null;
                    String publishDate = record.isMapped("publishDate") ? record.get("publishDate").trim() : "";
                    String publishedYear = "";
                    if (!publishDate.isBlank()) {
                        String[] parts = publishDate.split("\\s+");
                        publishedYear = parts[parts.length - 1];
                    }

                    String language = record.isMapped("language") ? record.get("language").trim() : null;

                    // Handle genres safely
                    Set<Genre> genreSet = new HashSet<>();
                    try {
                        if (record.isMapped("genres")) {
                            String[] genres = record.get("genres").split(";");
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
                        }
                    } catch (Exception e) {
                        // ignore genre parsing errors
                    }

                    // Build Book and BookMedia
                    Book book = new Book();
                    book.setTitle(title);
                    book.setAuthor(author);
                    book.setIsbn(isbn); // store normalized
                    book.setDescription(description);
                    book.setLanguage(language);
                    book.setNumOfPages(numOfPages);
                    book.setSeries(record.isMapped("series") ? record.get("series").trim() : null);
                    book.setGenres(genreSet);

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
                            .book(book)
                            .avgRating(0.0d)
                            .ratingCount(0L)
                            .build();
                    book.setBookOverallRating(bookOverallRating);

                    bookRepository.save(book);

                    // Update checkpoint for successful save
                    lastProcessed = recordNumber;
                    processedSinceFlush++;
                    if (processedSinceFlush >= CHECKPOINT_FLUSH_EVERY) {
                        writeLastCheckpoint(lastProcessed);
                        processedSinceFlush = 0;
                    }

                } catch (Exception perRecordEx) {
                    // Log and record failure, then continue
                    String isbnForLog = record.isMapped("isbn") ? record.get("isbn") : "<no-isbn>";
                    String titleForLog = record.isMapped("title") ? record.get("title") : "<no-title>";
                    String reason = perRecordEx.getClass().getSimpleName() + ": " + perRecordEx.getMessage();
                    System.err.printf("Failed to process record %d (isbn=%s title=%s): %s%n", recordNumber, isbnForLog, titleForLog, reason);

                    // write raw info into failed_records.csv for later inspection
                    try {
                        failedPrinter.printRecord(recordNumber, isbnForLog, titleForLog, reason);
                        failedPrinter.flush();
                    } catch (Exception e) {
                        System.err.println("Unable to write to failed_records.csv: " + e.getMessage());
                    }

                    // Advance checkpoint so we don't re-process this bad row repeatedly
                    lastProcessed = recordNumber;
                    processedSinceFlush++;
                    if (processedSinceFlush >= CHECKPOINT_FLUSH_EVERY) {
                        writeLastCheckpoint(lastProcessed);
                        processedSinceFlush = 0;
                    }
                    // continue to next record
                }
            } // end for loop

            // flush final checkpoint
            writeLastCheckpoint(lastProcessed);
        } // try-with-resources closes writer & reader
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

    public Page<BookListDTO> getBooks(int page, int size) {

        return bookRepository.findAllWithMediaAndRating(PageRequest.of(page, size));
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

