package org.a504.fitCoin.domain.mission.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.mission.dto.MissionAvailabilityResponse;
import org.a504.fitCoin.domain.mission.repository.MissionLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {
    private static final int DAILY_MISSION_LIMIT = 3;

    private final MissionLogRepository missionLogRepository;
    public MissionAvailabilityResponse getMissionAvailability(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();           // 오늘 00:00:00
        LocalDateTime endOfDay   = startOfDay.plusDays(1);                   // 내일 00:00:00

        int todayCompletedCount = missionLogRepository
                .countByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay);

        boolean missionAvailable = todayCompletedCount < DAILY_MISSION_LIMIT;

        return MissionAvailabilityResponse.builder()
                .missionAvailable(missionAvailable)
                .dailyMissionLimit(DAILY_MISSION_LIMIT)
                .todayCompletedMissionCount(todayCompletedCount)
                .build();
    }
}
