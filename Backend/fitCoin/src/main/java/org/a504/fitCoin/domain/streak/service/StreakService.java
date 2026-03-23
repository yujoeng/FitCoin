package org.a504.fitCoin.domain.streak.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.streak.dto.RecentStreakResponse;
import org.a504.fitCoin.domain.streak.entity.Streak;
import org.a504.fitCoin.domain.streak.repository.StreakJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
        int       currentStreak = 0;
        LocalDate cursor        = isChecked(streakMap, today) ? today : today.minusDays(1);

        while (true) {
            LocalDate cursorMonth = cursor.withDayOfMonth(1);

            // 해당 월 데이터 없으면 캐시에서 추가 조회
            if (!streakMap.containsKey(cursorMonth)) {
                Optional<Streak> extra = streakJpaRepository.findByUserIdAndYearAndMonth(userId, cursorMonth);
                if (extra.isEmpty()) break;
                streakMap.put(cursorMonth, extra.get());
            }

            if (!isChecked(streakMap, cursor)) break;

            currentStreak++;
            cursor = cursor.minusDays(1);
        }

        return RecentStreakResponse.builder()
                .currentStreak(currentStreak)
                .weeklyStreak(weeklyStreak)
                .build();
    }

    private boolean isChecked(Map<LocalDate, Streak> streakMap, LocalDate date) {
        Streak streak = streakMap.get(date.withDayOfMonth(1));
        return streak != null && streak.isChecked(date.getDayOfMonth());
    }
}