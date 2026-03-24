package org.a504.fitCoin.domain.mission.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.character.service.CharacterService;
import org.a504.fitCoin.domain.mission.dto.*;
import org.a504.fitCoin.domain.mission.entity.Mission;
import org.a504.fitCoin.domain.mission.entity.MissionLog;
import org.a504.fitCoin.domain.mission.repository.MissionLogRepository;
import org.a504.fitCoin.domain.mission.repository.MissionRedisRepository;
import org.a504.fitCoin.domain.mission.repository.MissionRepository;
import org.a504.fitCoin.domain.streak.service.StreakService;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
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
    private static final int  FIRST_MISSION_REWARD    = 1000;
    private static final int  OTHER_MISSION_REWARD    = 500;
    private static final long ABUSE_THRESHOLD_SECONDS = 10L;

    private final MissionLogRepository missionLogRepository;
    private final MissionRepository    missionRepository;
    private final MissionRedisRepository  missionRedisRepository;
    private final UserJpaRepository userJpaRepository;
    private final StreakService streakService;
    private final CharacterService characterService;

    @Transactional
    public MissionStartResponse startMission(Long userId, MissionStartRequest request) {
        // 1. 일일 한도 초과 여부 확인
        if (missionRedisRepository.findDailyCount(userId) >= DAILY_MISSION_LIMIT) {
            throw new CustomException(ErrorStatus.MISSION_DAILY_LIMIT_EXCEEDED);
        }

        // 2. 미션 존재 여부 확인
        Mission mission = missionRepository.findById(request.getMissionId())
                .orElseThrow(() -> new CustomException(ErrorStatus.MISSION_NOT_FOUND));

        // 3. Redis에 진행 중 미션 저장 (TTL 10분)
        missionRedisRepository.saveInProgress(userId, mission.getId(), request.getMissionStartedAt());

        return MissionStartResponse.builder()
                .missionId(mission.getId())
                .build();
    }

    @Transactional
    public MissionCompleteResponse completeMission(Long userId, MissionCompleteRequest request) {
        // 1. 요청으로 온 missionId 유효성 확인
        Mission mission = missionRepository.findById(request.getMissionId())
                .orElseThrow(() -> new CustomException(ErrorStatus.MISSION_NOT_FOUND));

        // 2. 일일 한도 초과 여부 확인
        int todayCompletedCount = missionRedisRepository.findDailyCount(userId);
        if (todayCompletedCount >= DAILY_MISSION_LIMIT) {
            throw new CustomException(ErrorStatus.MISSION_DAILY_LIMIT_EXCEEDED);
        }

        // 3. Redis에서 진행 중 미션 조회 + 즉시 삭제 (원자적 처리, 재전송 공격 방지)
        String inProgress = missionRedisRepository.findAndDeleteInProgress(userId);
        if (inProgress == null) {
            throw new CustomException(ErrorStatus.MISSION_LOG_NOT_FOUND);
        }

        // 4. Redis 값 파싱 (missionId:startedAt)
        String[]      parts           = inProgress.split(":", 2);
        Long          redisMissionId  = Long.parseLong(parts[0]);
        LocalDateTime missionStartedAt = LocalDateTime.parse(parts[1]);

        // 5. Redis에 저장된 missionId와 요청 missionId 일치 여부 확인
        if (!redisMissionId.equals(request.getMissionId())) {
            throw new CustomException(ErrorStatus.MISSION_TOKEN_INVALID);
        }

        // 6. 어뷰징 판별 (사용자에게 알리지 않고 내부 로깅만)
        long elapsedSeconds = Duration.between(missionStartedAt, request.getMissionCompletedAt()).getSeconds();
        if (elapsedSeconds < ABUSE_THRESHOLD_SECONDS) {
            log.warn("[어뷰징 의심] userId={}, missionId={}, 수행시간={}초", userId, redisMissionId, elapsedSeconds);
        }

        // 7. 보상 분기 (첫 번째 미션 여부)
        boolean isFirstMission = todayCompletedCount == 0;
        int     rewardPoint    = isFirstMission ? FIRST_MISSION_REWARD : OTHER_MISSION_REWARD;

        // 8. User 조회
        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.BAD_REQUEST));

        // 9. MissionLog 저장
        missionLogRepository.save(MissionLog.of(user, mission));

        // 10. 포인트 지급
        user.addPoint(rewardPoint);

        // 11. 스트릭 증가 (첫 번째 미션만)
        if (isFirstMission) {
            streakService.checkStreak(user);
        }

        // 12. 캐릭터 경험치 +1 (첫 번째 미션만)
        if(isFirstMission){
            characterService.addExp(user);
        }

        // 13. 일일 완료 횟수 +1
        missionRedisRepository.incrementDailyCount(userId);

        return MissionCompleteResponse.builder()
                .missionId(mission.getId())
                .rewardPoint(rewardPoint)
                .streakIncreased(isFirstMission)
                .characterExpGained(isFirstMission)
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