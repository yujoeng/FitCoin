package org.a504.fitCoin.domain.mission.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.mission.dto.MissionAvailabilityResponse;
import org.a504.fitCoin.domain.mission.dto.MissionCandidateDto;
import org.a504.fitCoin.domain.mission.dto.MissionCandidateListResponse;
import org.a504.fitCoin.domain.mission.repository.MissionLogRepository;
import org.a504.fitCoin.domain.mission.repository.MissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {
    private static final int DAILY_MISSION_LIMIT = 3;

    private final MissionLogRepository missionLogRepository;
    private final MissionRepository missionRepository;

    public MissionCandidateListResponse getMissionCandidates() {
        List<MissionCandidateDto> missions = missionRepository.findAll()
                .stream()
                .map(MissionCandidateDto::from)
                .collect(Collectors.toList());
        return MissionCandidateListResponse.from(missions);
    }
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
