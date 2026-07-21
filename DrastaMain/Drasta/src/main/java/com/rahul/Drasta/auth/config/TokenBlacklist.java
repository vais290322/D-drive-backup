package com.rahul.Drasta.auth.config;

import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {

    private final Set<String> blackListedToken = ConcurrentHashMap.newKeySet();

    public void blacklistToken(String token){
        blackListedToken.add(token);
    }

    public boolean isBlacklisted(String token){
        return blackListedToken.contains(token);
    }

}
