package com.MantriVenkatRaj.librarymanagement.message.services;

import com.MantriVenkatRaj.librarymanagement.Exception.NotAClubMemberException;
import com.MantriVenkatRaj.librarymanagement.Exception.UserNotFoundException;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubMemberRepository;
import com.MantriVenkatRaj.librarymanagement.message.dtos.MessageDTO;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import com.MantriVenkatRaj.librarymanagement.message.repositories.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MessageReadService {
    private final ClubMemberRepository clubMemberRepo;
    private final MessageRepository messageRepo;

    public MessageReadService(ClubMemberRepository clubMemberRepo, MessageRepository messageRepo) {
        this.clubMemberRepo = clubMemberRepo;
        this.messageRepo = messageRepo;
    }

    // Return unread counts { clubId -> unreadCount } for the user.
    @Transactional
    public Map<Long, Long> getUnreadCountsForUser(String username) {
        List<ClubMember> memberships = clubMemberRepo.findByUser_Username(username).orElseThrow(UserNotFoundException::new);
        Map<Long, Long> result = new HashMap<>();
        for (ClubMember m : memberships) {
            Long lastRead = m.getLastReadMessageId() == null ? 0L : m.getLastReadMessageId();
            Long clubId = m.getClub().getId();
            Long count = messageRepo.countByClub_IdAndIdGreaterThanAndSender_UsernameNot(clubId, lastRead,username);
            result.put(clubId, count);
        }
        return result;
    }

     // Set membership.lastReadMessageId to the latest message id in the club (if exists).
    @Transactional
    public ResponseEntity<String> markClubAsRead(String username, String clubname) {
        Optional<ClubMember> maybe = clubMemberRepo.findByUser_UsernameAndClub_Name(username, clubname);
        if (maybe.isEmpty()) return ResponseEntity.notFound().build();
        ClubMember membership = maybe.get();

        Optional<Message> lastOpt = messageRepo.findTopByClub_NameOrderByIdDesc(clubname);
        lastOpt.ifPresent(last -> {
            membership.setLastReadMessageId(last.getId());
            clubMemberRepo.save(membership);
        });
        return ResponseEntity.ok("Read all the messages of club : "+clubname);
    }

    /**
     * Fetch messages since a given id (wrapper).
     */
    @Transactional
    public List<MessageDTO> fetchMessagesSince(String clubname, String username, Long sinceId) {
        if (sinceId == null) sinceId = 0L;
        ClubMember clubMember=clubMemberRepo.findByUser_UsernameAndClub_Name(username,clubname)
                .orElseThrow(NotAClubMemberException::new);
        List<Message> messages=messageRepo.findByClub_NameAndIdGreaterThanOrderByIdAsc(clubname, sinceId);
        var last=messages.isEmpty()?null:messages.getLast().getId();
        clubMember.setLastReadMessageId(last);
        clubMemberRepo.save(clubMember);
        return messages.stream().map(message -> {
                return  MessageDTO.builder()
                    .id(message.getId())
                    .sendername(message.getSender().getUsername())
                    .content(message.getContent())
                    .clubname(message.getClub().getName())
                    .sentAt(message.getSentAt()).build();
        }).toList();
    }
}
