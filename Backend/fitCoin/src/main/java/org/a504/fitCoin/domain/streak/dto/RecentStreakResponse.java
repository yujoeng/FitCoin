package org.a504.fitCoin.domain.streak.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class RecentStreakResponse {

    private int currentStreak;
    private List<DailyStreak> weeklyStreak;

    @Getter
    @Builder
    public static class DailyStreak {
        private LocalDate date;
        private boolean checked;
    }
}