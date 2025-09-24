package com.MantriVenkatRaj.librarymanagement.bookclub.resources;

import com.MantriVenkatRaj.librarymanagement.bookclub.dto.BookClubDTO;
import com.MantriVenkatRaj.librarymanagement.bookclub.requests.ClubRequest;
import com.MantriVenkatRaj.librarymanagement.bookclub.services.BookClubService;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookclubs/")
public class BookClubResource {
    private final BookClubService bookClubService;

    public BookClubResource(BookClubService bookClubService) {
        this.bookClubService = bookClubService;
    }
    @GetMapping("/getall")
    public ResponseEntity<List<BookClubDTO>> getAllClubs(){
        return ResponseEntity.ok(bookClubService.getAllClubs());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createClub(@RequestBody ClubRequest request){
        bookClubService.createClub(request);
        return ResponseEntity.ok("Club created successfully");
    }

    @GetMapping("/recommend/{isbn}")
    public ResponseEntity<List<BookClubDTO>> recommend(@PathVariable String isbn){
        return ResponseEntity.ok(bookClubService.recommendClubsForBook(isbn));
    }

    @GetMapping("/getclub/{clubname}")
    public ResponseEntity<BookClubDTO> getClub(@PathVariable String clubName){
        return ResponseEntity.ok(bookClubService.getClubDTO(clubName));
    }

    @GetMapping("/{clubname}/getmessages")
    public ResponseEntity<List<Message>> getClubMessages(@PathVariable String clubname){
        return bookClubService.getMessages(clubname);
    }
    @PostMapping("/{clubname}/join/{username}")
    public ResponseEntity<String> joinClub(@PathVariable String clubname,@PathVariable String username){
        return bookClubService.joinClub(clubname,username);
    }


}
