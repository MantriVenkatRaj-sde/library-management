package com.MantriVenkatRaj.librarymanagement.bookclub.services;

import com.MantriVenkatRaj.librarymanagement.Exception.ClubNotFoundException;
import com.MantriVenkatRaj.librarymanagement.book.BookService;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookComponentDTO;
import com.MantriVenkatRaj.librarymanagement.bookclub.dto.BookClubDTO;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.bookclub.enums.MembershipRole;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubRepository;
import com.MantriVenkatRaj.librarymanagement.bookclub.requests.ClubRequest;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.shuffle;

@Service
public class BookClubService {
    private final ClubRepository clubRepository;
    private final UserService userService;
    private final BookService bookService;
    private final ClubMemberService clubMemberService;


    public BookClubService(com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubRepository clubRepository, UserService userService, BookService bookService, ClubMemberService clubMemberService) {
        this.clubRepository = clubRepository;
        this.userService = userService;
        this.bookService = bookService;
        this.clubMemberService = clubMemberService;
    }

    public List<BookClubDTO> getAllClubs() {
        return clubRepository.findAll().stream().map(club ->
                BookClubDTO.builder()
                        .id(club.getId())
                        .name(club.getName())
                        .description(club.getDescription())
                        .visibility(club.getVisibility())
                        .createdAt(club.getCreatedAt())
                        .admin(club.getAdmin().getUsername())
                        .build()).toList();
    }

    public void createClub(ClubRequest request) {
        User admin=userService.findByUsername(request.admin());
        clubRepository.save(BookClub.builder()
                .name(request.name())
                .description(request.description())
                .visibility(request.visibility())
                .admin(admin)
                .build());
//        BookClub club=clubRepository.findByName(request.name()).orElseThrow(ClubNotFoundException::new);
//        ClubMember.builder()
//                .club(club)
//                .user(admin)
//                .role(MembershipRole.ADMIN)
//                .build();
        clubMemberService.joinClub(request.name(), request.admin(),MembershipRole.ADMIN);

    }

    public List<BookClubDTO> recommendClubsForBook(String isbn) {
        // findBookByIsbn should either throw a custom NotFoundException or return null
        BookComponentDTO book = bookService.findBookByIsbn(isbn);
        if (book == null) {
            // return empty list or throw — choose what fits your API style
            return Collections.emptyList();
        }

        // Use a LinkedHashMap to dedupe by id while preserving insertion order (title first, then genres)
        Map<Long, BookClub> dedupe = new HashMap<>();

        // search by title (one DB call)
        if (StringUtils.hasText(book.getTitle())) {
            List<BookClub> byTitle = clubRepository.searchByKeyword(book.getTitle());
            for (BookClub c : byTitle) {
                if (c != null && c.getId() != null) dedupe.putIfAbsent(c.getId(), c);
            }
        }

        // search by genres (aggregate queries). Use a Set to avoid repeating the same genre string.
        if (book.getGenres() != null && !book.getGenres().isEmpty()) {
            Set<String> genres = book.getGenres().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            for (String genre : genres) {
                List<BookClub> byGenre = clubRepository.searchByKeyword(genre);
                for (BookClub c : byGenre) {
                    if (c != null && c.getId() != null) dedupe.putIfAbsent(c.getId(), c);
                }
            }
        }

        // Convert to DTO. Optionally limit results (e.g., top 20)
        int LIMIT = 20;

        List<BookClubDTO> clublist = dedupe.values().stream()
                .limit(LIMIT)
                .map(club -> BookClubDTO.builder()
                        .id(club.getId())
                        .name(club.getName())
                        .description(club.getDescription())
                        .visibility(club.getVisibility())
                        .createdAt(club.getCreatedAt())
                        .admin(club.getAdmin() != null ? club.getAdmin().getUsername() : null)
                        .build())
                .collect(Collectors.toList());

        if (!clublist.isEmpty()) {
            Collections.shuffle(clublist);
        }
        return clublist;
    }

    public BookClubDTO getClubDTO(String clubName) {
        BookClub club=clubRepository.findByName(clubName).orElseThrow(ClubNotFoundException::new);
        return BookClubDTO.builder()
                .name(club.getName())
                .description(club.getDescription())
                .visibility(club.getVisibility())
                .admin(club.getAdmin().getUsername())
                .id(club.getId())
                .createdAt(club.getCreatedAt())
                .build();

    }
    public BookClub getClub(String clubName) {
        return clubRepository.findByName(clubName).orElseThrow(ClubNotFoundException::new);

    }

    public ResponseEntity<List<Message>> getMessages(String clubname) {
        BookClub club=clubRepository.findByName(clubname).orElseThrow(ClubNotFoundException::new);
        return ResponseEntity.ok(club.getMessages());

    }

    public ResponseEntity<String> joinClub(String clubname, String username) {
        ClubMember clubMember=clubMemberService.joinClub(clubname,username,MembershipRole.MEMBER);
        if(clubMember==null){
            return ResponseEntity.badRequest().body("Failed to join the club");
        }
        return ResponseEntity.ok("User joined the club successfully!");

    }
}