package com.MantriVenkatRaj.librarymanagement.message.services;


import com.MantriVenkatRaj.librarymanagement.Exception.ClubNotFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.NotAClubMemberException;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubMemberRepository;
import com.MantriVenkatRaj.librarymanagement.bookclub.repositories.ClubRepository;
import com.MantriVenkatRaj.librarymanagement.message.dtos.MessageDTO;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import com.MantriVenkatRaj.librarymanagement.message.repositories.MessageRepository;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final ClubRepository clubRepository;
    private final UserService userService;
    private  final ClubMemberRepository clubMemberRepository;

    public MessageService(MessageRepository messageRepo, SimpMessagingTemplate messagingTemplate, ClubRepository clubRepository, UserService userService, ClubMemberRepository clubMemberRepository) {
        this.messageRepo = messageRepo;
        this.messagingTemplate = messagingTemplate;
        this.clubRepository = clubRepository;
        this.userService = userService;
        this.clubMemberRepository = clubMemberRepository;
    }

    /**
     * Persist the message and broadcast DTO to /topic/bookclub.{clubId}
     */
    @Transactional
    public Message postMessage(String clubname, String username, String content) {
        Message msg = new Message();
        BookClub club=clubRepository.findByName(clubname).orElseThrow(ClubNotFoundException::new);
        User user=userService.findByUsername(username);
        msg.setClub(club);
        msg.setSender(user);
        msg.setContent(content);
        msg.setSentAt(Instant.now());
        Message saved = messageRepo.save(msg); // persisting the message

        // convert to DTO and broadcast
        MessageDTO dto = toDto(saved);
        messagingTemplate.convertAndSend("/topic/bookclub." + clubname, dto);

        return saved;
    }


    //typing indicator (broadcast lightweight event)
    public void sendTypingIndicator(String clubname, String username) {
        // You can create a small DTO for typing events; here we reuse MessageDTO partially
        messagingTemplate.convertAndSend("/topic/bookclub." + clubname + ".typing",
                String.format("{\"username\":%s}", username));
    }

    private MessageDTO toDto(Message m) {
        return MessageDTO.builder()
                .id(m.getId())
                .clubname(m.getClub().getName())
                .sendername(m.getSender().getUsername())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .build();
    }

    public List<MessageDTO> getAllMessages(String clubname,String username) {
        List<Message> messages=messageRepo.findAllByClub_Name(clubname);
        clubRepository.findByName(clubname).orElseThrow(ClubNotFoundException::new);
        if(!messages.isEmpty()){
            ClubMember cm=clubMemberRepository.findByUser_UsernameAndClub_Name(username,clubname)
                    .orElseThrow(NotAClubMemberException::new);
            cm.setLastReadMessageId(messages.getLast().getId());
            clubMemberRepository.save(cm);
        }
        return messages.stream().map(message -> {
            return  MessageDTO.builder()
                    .id(message.getId())
                    .sendername(message.getSender().getUsername())
                    .content(message.getContent())
                    .clubname(message.getClub().getName())
                    .sentAt(message.getSentAt()).build();
        }).toList();
    }

    public void deleteClubMessages(String clubname) {
        messageRepo.deleteByClub_Name(clubname);
    }
}
