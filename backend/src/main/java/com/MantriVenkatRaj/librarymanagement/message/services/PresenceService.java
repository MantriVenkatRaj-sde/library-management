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
    private final Map<String,String> activeClubByUser = new ConcurrentHashMap<>();

    public void setActiveClub(String username, String clubname) {
        if (clubname == null) activeClubByUser.remove(username);
        else activeClubByUser.put(username, clubname);
    }

    public String getActiveClub(String username) {
        return activeClubByUser.get(username);
    }

    public void removeUser(String username) {
        activeClubByUser.remove(username);
    }
}
