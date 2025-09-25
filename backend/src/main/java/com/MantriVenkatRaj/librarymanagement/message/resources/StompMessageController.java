package com.MantriVenkatRaj.librarymanagement.message.resources;

import com.MantriVenkatRaj.librarymanagement.message.requests.MessageCreateRequest;
import com.MantriVenkatRaj.librarymanagement.message.services.MessageService;
import com.MantriVenkatRaj.librarymanagement.message.services.PresenceService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

@Controller
public class StompMessageController {
    private final MessageService messageService;
    private final PresenceService presenceService;

    public StompMessageController(MessageService messageService, PresenceService presenceService) {
        this.messageService = messageService;
        this.presenceService = presenceService;
    }

    // Destination to send this message /app/chat.send
    @MessageMapping("/chat.send")
    public void handleStompSend(@Payload MessageCreateRequest req) {
        // Persist & broadcast (ChatService handles conversion to DTO and broadcasting)
        messageService.postMessage(req.getClubname(), req.getSendername(), req.getContent());
    }

    /**
     * Optional: client notifies server which club it is currently viewing.
     * Client STOMP destination: /app/presence.active
     * Payload: { "userId": 2, "clubId": 3 } (clubId can be null to clear)
     */
    @MessageMapping("/presence.active")
    public void handlePresence(MessageCreateRequest.PresenceRequest presence) {
        if (presence == null) return;
        if (presence.getClubname() == null) {
            presenceService.setActiveClub(presence.getUsername(), null);
        } else {
            presenceService.setActiveClub(presence.getUsername(), presence.getClubname());
        }
    }
}
