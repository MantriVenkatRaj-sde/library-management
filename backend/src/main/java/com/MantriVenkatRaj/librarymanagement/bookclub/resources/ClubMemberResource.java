package com.MantriVenkatRaj.librarymanagement.bookclub.resources;

import com.MantriVenkatRaj.librarymanagement.bookclub.dto.BookClubDTO;
import com.MantriVenkatRaj.librarymanagement.bookclub.services.ClubMemberService;
import com.MantriVenkatRaj.librarymanagement.user.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
@RestController
public class ClubMemberResource {
    private final ClubMemberService clubMemberService;

    public ClubMemberResource(ClubMemberService clubMemberService) {
        this.clubMemberService = clubMemberService;
    }

    @GetMapping("/{username}/membership")
    public ResponseEntity<List<BookClubDTO>> getUserMembership(@PathVariable String username){
        List<BookClubDTO> membership=clubMemberService.getUserMembership(username);
        return ResponseEntity.ok(membership);
    }
    @DeleteMapping("/{username}/membership/{clubname}/remove")
    public ResponseEntity<String> deleteMembership(@PathVariable String username,
                                                   @PathVariable String clubname){
        clubMemberService.removeMembership(username,clubname);
        return ResponseEntity.ok("Club left");
    }

    @GetMapping("/admin/{username}/club/{clubname}/members")
    public ResponseEntity<HashMap<Long, String>> getClubMembers(@PathVariable String username, @PathVariable String clubname){
        return ResponseEntity.ok(clubMemberService.getClubMembers(username, clubname));
    }

}
