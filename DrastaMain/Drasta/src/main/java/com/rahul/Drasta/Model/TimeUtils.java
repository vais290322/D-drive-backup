package com.rahul.Drasta.Model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class TimeUtils {

    public static String getTimeAgo(LocalDateTime postTime) {
        if (postTime == null) return "Unknown";

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(postTime, now);

        if (duration.toMinutes() < 1) return "Just now";
        if (duration.toMinutes() < 60) return duration.toMinutes() + " minutes ago";
        if (duration.toHours() < 24) return duration.toHours() + " hours ago";
        if (duration.toDays() < 7) return duration.toDays() + " days ago";

        return postTime.toLocalDate().toString(); // fallback: return date
    }
}

