package com.MantriVenkatRaj.librarymanagement.genre;

import jakarta.annotation.PostConstruct;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.Reader;
import java.util.List;

@Service
public class GenreService implements CommandLineRunner {
    @Autowired
    private GenreRepository genreRepository;

//    @PostConstruct
    public void loadCSV() throws Exception {
        try (Reader reader = new FileReader("D:/Library Management System/LibraryData/genres.csv")) {
            Iterable<CSVRecord> records = CSVFormat.DEFAULT
                    .withHeader("genreId", "name")
                    .withFirstRecordAsHeader()
                    .withTrim()
                    .parse(reader);


            for (CSVRecord record : records) {
                Genre genre = new Genre();
                genre.setName(record.get("name").trim().toLowerCase());
                try {
                    genreRepository.save(genre);
                } catch (Exception e) {
                    continue;
                }
            }
        }
    }

    @Override
    public void run(String... args) throws Exception {
        if (genreRepository.count() == 0) {
            loadCSV();
        }
    }

    public List<String> getAllGenres() {
        return genreRepository.findAll()
                .stream()
                .map(Genre::getName)
                .toList();
    }
}
