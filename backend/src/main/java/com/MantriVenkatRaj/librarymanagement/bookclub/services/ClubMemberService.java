package com.MantriVenkatRaj.librarymanagement.bookclub.services;

import com.MantriVenkatRaj.librarymanagement.Exception.*;
import com.MantriVenkatRaj.librarymanagement.bookclub.dto.BookClubDTO;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.bookclub.enums.MembershipRole;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubMemberRepository;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubRepository;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserDTO;
import com.MantriVenkatRaj.librarymanagement.user.UserService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ClubMemberService {
    private final ClubRepository clubRepository;
    private final UserService userService;
    private final ClubMemberRepository clubMemberRepository;
    public ClubMemberService(ClubRepository clubRepository, UserService userService, ClubMemberRepository clubMemberRepository) {
        this.clubRepository = clubRepository;
        this.userService = userService;
        this.clubMemberRepository = clubMemberRepository;
    }


    public ClubMember joinClub(String clubname,String username,MembershipRole role){
        BookClub club=clubRepository.findByName(clubname).orElseThrow(ClubNotFoundException::new);
        User user=userService.findByUsername(username);
        ClubMember clubMember=ClubMember.builder()
                .club(club)
                .user(user)
                .role(role)
                .build();
        //User has joined a club
        user.addMembership(clubMember);
        //Club has a new member
        club.addMember(clubMember);
        clubMemberRepository.save(clubMember);
        return clubMember;

//         return  MembershipDTO.builder()
//                .id(clubMember.getId())
//                .clubId(clubMember.getClub().getId())
//                .userId(clubMember.getUser().getId())
//                .username(clubMember.getUser().getUsername())
//                .clubName(clubMember.getClub().getName())
//                .role(clubMember.getRole())
//                .joinedAt(clubMember.getJoinedAt())
//                .build();
    }

    public List<BookClubDTO> getUserMembership(String username) {
        List<ClubMember> list=clubMemberRepository.findByUser_UsernameOrderByLastActivity(username);

        return  list.stream().map(ClubMember::getClub)
                .map(club->
                        BookClubDTO.builder()
                                .id(club.getId())
                                .name(club.getName())
                                .description(club.getDescription())
                                .visibility(club.getVisibility())
                                .createdAt(club.getCreatedAt())
                                .admin(club.getAdmin().getUsername())
                                .lastMessageAt(club.getLastMessageAt())
                                .build()).toList();
    }

    @Transactional
    public void removeMembership(String username, String clubname) {
        ClubMember cm = clubMemberRepository
                .findByUser_UsernameAndClub_Name(username, clubname)
                .orElseThrow(NotAClubMemberException::new);

        // Block admin from leaving if that's your rule:
        if (Objects.equals(cm.getClub().getAdmin().getUsername(), username)) {
            throw new AdminCantLeaveException();
        }

        cm.getUser().getMemberships().remove(cm); // orphanRemoval deletes row
        cm.getClub().getMembers().remove(cm);     // keep other side tidy
    }

    public HashMap<Long,String> getClubMembers(String username, String clubname) {
        User user=userService.findByUsername(username);
        BookClub club=clubRepository.findByName(clubname).orElseThrow(ClubNotFoundException::new);
        if(!Objects.equals(user.getUsername(), club.getAdmin().getUsername())){
            throw new NotTheAdminException();
        }
        HashMap<Long,String> map=new HashMap<>();
        return (HashMap<Long, String>) club.getMembers().stream()
                .collect(Collectors.toMap(
                        ClubMember::getId,
                        m -> m.getUser().getUsername()
                ));
    }
}
