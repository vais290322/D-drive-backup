package com.rahul.Drasta.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {
    private final int MAX_ATTEMPTS = 5;
    private final long BLOCK_TIME_MS = 15 * 60 * 1000; // 15 mins

    private final Map<String, Integer> attempts = new ConcurrentHashMap<>();
    private final Map<String, Long> blockedUntil = new ConcurrentHashMap<>();

    public void loginFailed(String email) {
        attempts.put(email, attempts.getOrDefault(email, 0) + 1);
        if (attempts.get(email) >= MAX_ATTEMPTS) {
            blockedUntil.put(email, System.currentTimeMillis() + BLOCK_TIME_MS);
        }
    }

    public void loginSucceeded(String email) {
        attempts.remove(email);
        blockedUntil.remove(email);
    }

    public boolean isBlocked(String email) {
        Long blockedTime = blockedUntil.get(email);
        if (blockedTime == null) return false;
        if (System.currentTimeMillis() > blockedTime) {
            blockedUntil.remove(email);
            return false;
        }
        return true;
    }
}
