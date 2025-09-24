package com.MantriVenkatRaj.librarymanagement.bookclub.services;

import com.MantriVenkatRaj.librarymanagement.Exception.ClubNotFoundException;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.bookclub.enums.MembershipRole;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubMemberRepository;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubRepository;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
}
