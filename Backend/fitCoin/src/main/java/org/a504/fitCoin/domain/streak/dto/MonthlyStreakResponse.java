package org.a504.fitCoin.domain.streak.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class MonthlyStreakResponse {

    private int year;
    private int month;
    private int currentStreak;
    private List<DailyStreak> monthlyStreak;

    @Getter
    @Builder
    public static class DailyStreak {
        private LocalDate date;
        private boolean checked;
    }
}