package com.MantriVenkatRaj.librarymanagement.configs;


import com.MantriVenkatRaj.librarymanagement.jwt.JwtTokenProvider;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider; // your existing JWT helper

    public JwtChannelInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // read Authorization native header sent by client
            List<String> authHeaders = accessor.getNativeHeader("Authorization");
            String bearer = (authHeaders != null && !authHeaders.isEmpty()) ? authHeaders.get(0) : null;
            if (bearer != null && bearer.startsWith("Bearer ")) {
                String token = bearer.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String username = jwtTokenProvider.getUsername(token);
                    // build Authentication using username + roles (if you have them)
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            jwtTokenProvider.getAuthorities(token) // return emptyList() if none
                    );
                    accessor.setUser(auth); // <-- this attaches Principal to the session
                }
            }
        }
        return message;
    }
}