package org.a504.fitCoin.domain.mission.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.mission.dto.MissionStartRequest;
import org.a504.fitCoin.domain.mission.dto.MissionCompleteRequest;
import org.a504.fitCoin.domain.mission.dto.MissionAvailabilityResponse;
import org.a504.fitCoin.domain.mission.dto.MissionCandidateDto;
import org.a504.fitCoin.domain.mission.dto.MissionCandidateListResponse;
import org.a504.fitCoin.domain.mission.dto.MissionCompleteResponse;
import org.a504.fitCoin.domain.mission.dto.MissionStartResponse;
import org.a504.fitCoin.domain.mission.entity.Mission;
import org.a504.fitCoin.domain.mission.repository.MissionLogRepository;
import org.a504.fitCoin.domain.mission.repository.MissionRedisRepository;
import org.a504.fitCoin.domain.mission.repository.MissionRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {

    private static final int  DAILY_MISSION_LIMIT     = 3;

    private final MissionLogRepository missionLogRepository;
    private final MissionRepository    missionRepository;
    private final MissionRedisRepository  missionRedisRepository;

    @Transactional
    public MissionStartResponse startMission(Long userId, MissionStartRequest request) {
        // 1. 일일 한도 초과 여부 확인
        if (missionRedisRepository.findDailyCount(userId) >= DAILY_MISSION_LIMIT) {
            throw new CustomException(ErrorStatus.MISSION_DAILY_LIMIT_EXCEEDED);
        }

        // 2. 이미 진행 중인 미션 있는지 확인
        if (missionRedisRepository.existsInProgress(userId)) {
            throw new CustomException(ErrorStatus.MISSION_ALREADY_IN_PROGRESS);
        }

        // 3. 미션 존재 여부 확인
        Mission mission = missionRepository.findById(request.getMissionId())
                .orElseThrow(() -> new CustomException(ErrorStatus.MISSION_NOT_FOUND));

        // 4. Redis에 진행 중 미션 저장 (TTL 5분)
        missionRedisRepository.saveInProgress(userId, mission.getId(), request.getMissionStartedAt());

        return MissionStartResponse.builder()
                .missionId(mission.getId())
                .build();
    }
    public MissionCandidateListResponse getMissionCandidates() {
        List<MissionCandidateDto> missions = missionRepository.findAll()
                .stream()
                .map(MissionCandidateDto::from)
                .collect(Collectors.toList());
        return MissionCandidateListResponse.from(missions);
    }
    public MissionAvailabilityResponse getMissionAvailability(Long userId) {
        int     todayCompletedCount = missionRedisRepository.findDailyCount(userId);
        boolean missionAvailable    = todayCompletedCount < DAILY_MISSION_LIMIT;

        return MissionAvailabilityResponse.builder()
                .missionAvailable(missionAvailable)
                .dailyMissionLimit(DAILY_MISSION_LIMIT)
                .todayCompletedMissionCount(todayCompletedCount)
                .build();
    }
}