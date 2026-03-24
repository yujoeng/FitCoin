package org.a504.fitCoin.domain.streak.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.streak.dto.MonthlyStreakResponse;
import org.a504.fitCoin.domain.streak.dto.RecentStreakResponse;
import org.a504.fitCoin.domain.streak.entity.Streak;
import org.a504.fitCoin.domain.streak.repository.StreakJpaRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StreakService {

    private final StreakJpaRepository streakJpaRepository;

    @Transactional
    public void checkStreak(User user) {
        LocalDate today    = LocalDate.now();
        LocalDate monthKey = today.withDayOfMonth(1);

        // 해당 월 streak 조회, 없으면 새로 생성
        Streak streak = streakJpaRepository
                .findByUserIdAndYearAndMonth(user.getId(), monthKey)
                .orElseGet(() -> streakJpaRepository.save(Streak.of(user, monthKey)));

        // 오늘 날짜 비트 ON
        streak.checkDay(today.getDayOfMonth());
    }

    public MonthlyStreakResponse getMonthlyStreak(Long userId, int year, int month) {
        YearMonth yearMonth  = YearMonth.of(year, month);
        LocalDate  monthStart = yearMonth.atDay(1);
        LocalDate  monthEnd   = yearMonth.atEndOfMonth();
        LocalDate  today      = LocalDate.now();

        // 1. 해당 월 스트릭 조회
        Map<LocalDate, Streak> streakMap = streakJpaRepository
                .findByUserIdAndMonthBetween(userId, monthStart, monthStart)
                .stream()
                .collect(Collectors.toMap(Streak::getYearAndMonth, s -> s));

        // 2. 해당 월 일별 출석 여부 목록 생성 (오늘 이후는 포함하지 않음)
        List<MonthlyStreakResponse.DailyStreak> monthlyStreak = new ArrayList<>();
        for (int day = 1; day <= monthEnd.getDayOfMonth(); day++) {
            LocalDate date = monthStart.withDayOfMonth(day);
            if (date.isAfter(today)) break; // 오늘 이후 날짜 제외

            Streak  streak  = streakMap.get(monthStart);
            boolean checked = streak != null && streak.isChecked(day);

            monthlyStreak.add(MonthlyStreakResponse.DailyStreak.builder()
                    .date(date)
                    .checked(checked)
                    .build());
        }

        // 3. 연속 스트릭 계산
        int currentStreak = calcCurrentStreak(userId, streakMap, today);

        return MonthlyStreakResponse.builder()
                .year(year)
                .month(month)
                .currentStreak(currentStreak)
                .monthlyStreak(monthlyStreak)
                .build();
    }

    public RecentStreakResponse getRecentStreak(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6); // 오늘 포함 7일

        // 1. 최근 7일이 걸쳐있는 월 범위 조회 (최대 2개월)
        LocalDate fromMonth = sevenDaysAgo.withDayOfMonth(1);
        LocalDate toMonth   = today.withDayOfMonth(1);

        List<Streak> streaks = streakJpaRepository.findByUserIdAndMonthBetween(userId, fromMonth, toMonth);
        Map<LocalDate, Streak> streakMap = streaks.stream()
                .collect(Collectors.toMap(Streak::getYearAndMonth, s -> s));

        // 2. 최근 7일 출석 여부 목록 생성
        List<RecentStreakResponse.DailyStreak> weeklyStreak = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date        = today.minusDays(i);
            LocalDate monthKey    = date.withDayOfMonth(1);
            Streak    streak      = streakMap.get(monthKey);
            boolean   checked     = streak != null && streak.isChecked(date.getDayOfMonth());

            weeklyStreak.add(RecentStreakResponse.DailyStreak.builder()
                    .date(date)
                    .checked(checked)
                    .build());
        }

        // 3. 연속 스트릭 계산 (오늘 미출석이면 어제부터 역순으로 카운트)
        int currentStreak = calcCurrentStreak(userId, streakMap, today);

        return RecentStreakResponse.builder()
                .currentStreak(currentStreak)
                .weeklyStreak(weeklyStreak)
                .build();
    }

    // 연속 스트릭 계산 공통 메서드
    private int calcCurrentStreak(Long userId, Map<LocalDate, Streak> streakMap, LocalDate today) {
        int       currentStreak = 0;
        LocalDate cursor        = isChecked(streakMap, today) ? today : today.minusDays(1);

        while (true) {
            LocalDate cursorMonth = cursor.withDayOfMonth(1);

            if (!streakMap.containsKey(cursorMonth)) {
                Optional<Streak> extra = streakJpaRepository.findByUserIdAndYearAndMonth(userId, cursorMonth);
                if (extra.isEmpty()) break;
                streakMap.put(cursorMonth, extra.get());
            }

            if (!isChecked(streakMap, cursor)) break;

            currentStreak++;
            cursor = cursor.minusDays(1);
        }

        return currentStreak;
    }

    private boolean isChecked(Map<LocalDate, Streak> streakMap, LocalDate date) {
        Streak streak = streakMap.get(date.withDayOfMonth(1));
        return streak != null && streak.isChecked(date.getDayOfMonth());
    }
}