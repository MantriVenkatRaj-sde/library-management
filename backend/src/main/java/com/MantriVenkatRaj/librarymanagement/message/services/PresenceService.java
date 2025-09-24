package com.MantriVenkatRaj.librarymanagement.message.services;


import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Very small in-memory presence tracker. For multiple-node setups use Redis.
 */
@Service
public class PresenceService {

    // userId -> activeClubId (nullable)
    private final Map<Long, Long> activeClubByUser = new ConcurrentHashMap<>();

    public void setActiveClub(Long userId, Long clubId) {
        if (clubId == null) activeClubByUser.remove(userId);
        else activeClubByUser.put(userId, clubId);
    }

    public Long getActiveClub(Long userId) {
        return activeClubByUser.get(userId);
    }

    public void removeUser(Long userId) {
        activeClubByUser.remove(userId);
    }
}
