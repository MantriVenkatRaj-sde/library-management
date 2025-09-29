package com.MantriVenkatRaj.librarymanagement.message.resources;

import com.MantriVenkatRaj.librarymanagement.message.dtos.MessageDTO;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import com.MantriVenkatRaj.librarymanagement.message.requests.MessageCreateRequest;
import com.MantriVenkatRaj.librarymanagement.message.services.MessageReadService;
import com.MantriVenkatRaj.librarymanagement.message.services.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
public class MessageResource {

    private final MessageService messageService;
    private final MessageReadService messageReadService;

    public MessageResource(MessageService messageService, MessageReadService messageReadService) {
        this.messageService = messageService;
        this.messageReadService = messageReadService;
    }


    /**
     * Fetch messages for a club since a given id.
     * GET /api/chat/clubs/{clubId}/messages?sinceId={sinceId}
     */
//    @GetMapping("/clubs/{clubname}/latestmessages/{username}")
//    public ResponseEntity<List<MessageDTO>> getMessagesSince(
//            @PathVariable String clubname,
//            @PathVariable String username,
//            @RequestParam(required = false) Long sinceId) {
//
//        List<MessageDTO> msgs = messageReadService.fetchMessagesSince(clubname, username, sinceId);
//        return ResponseEntity.ok(msgs);
//    }
    @GetMapping("/clubs/{clubname}/allmessages/{username}")
    public ResponseEntity<List<MessageDTO>> getAllMessagesSince(
            @PathVariable String clubname,
            @PathVariable String username,
            @RequestParam(required = false) Long sinceId) {

        List<MessageDTO> msgs = messageService.getAllMessages(clubname,username);
        return ResponseEntity.ok(msgs);
    }

    /**
     * Get unread counts for all clubs that the user is a member of.
     * GET /api/chat/members/{userId}/unread
     * returns: { clubId -> unreadCount }
     */
    @GetMapping("/{username}/messages/unread")
    public ResponseEntity<Map<Long, Long>> getUnreadCounts(@PathVariable String username) {
        Map<Long, Long> counts = messageReadService.getUnreadCountsForUser(username);
        return ResponseEntity.ok(counts);
    }

    /**
     * Mark a club as read for a given user (set lastReadMessageId to latest message id).
     * POST /api/chat/members/{username}/clubs/{clubname}/mark-read
     */
    @PostMapping("/members/{username}/clubs/{clubname}/mark-read")
    public ResponseEntity<String> markRead(@PathVariable String username, @PathVariable String clubname) {
        return messageReadService.markClubAsRead(username, clubname);

    }

    /**
     * Optional: Post a message via REST instead of STOMP.
     * POST /api/chat/messages
     * Body: { clubId, senderId, content }
     */
    @PostMapping("/messages")
    public ResponseEntity<Message> postMessage(@RequestBody MessageCreateRequest req) {
        Message saved = messageService.postMessage(req.getClubname(), req.getSendername(), req.getContent());
        // Return 201 with location if you want:
        return ResponseEntity.created(URI.create("/chat/clubs/" + saved.getClub().getName() + "/messages"))
                .body(saved);
    }
}
