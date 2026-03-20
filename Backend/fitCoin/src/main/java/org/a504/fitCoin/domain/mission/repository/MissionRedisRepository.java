package org.a504.fitCoin.domain.mission.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Repository
@RequiredArgsConstructor
public class MissionRedisRepository {

    private static final String IN_PROGRESS_KEY        = "mission:inProgress:";
    private static final String DAILY_COUNT_KEY        = "mission:dailyCount:";
    private static final long   IN_PROGRESS_TTL_MINUTES = 10L;

    private final StringRedisTemplate redisTemplate;

    // 진행 중 미션 저장 (missionId:startedAt)
    public void saveInProgress(Long userId, Long missionId, LocalDateTime startedAt) {
        String key   = IN_PROGRESS_KEY + userId;
        String value = missionId + ":" + startedAt;
        redisTemplate.opsForValue().set(key, value, Duration.ofMinutes(IN_PROGRESS_TTL_MINUTES));
    }

    // 진행 중 미션 조회
    public String findInProgress(Long userId) {
        return redisTemplate.opsForValue().get(IN_PROGRESS_KEY + userId);
    }

    // 진행 중 미션 삭제
    public void deleteInProgress(Long userId) {
        redisTemplate.delete(IN_PROGRESS_KEY + userId);
    }

    // 진행 중 미션 여부
    public boolean existsInProgress(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(IN_PROGRESS_KEY + userId));
    }

    // 오늘 완료 횟수 조회
    public int findDailyCount(Long userId) {
        String value = redisTemplate.opsForValue().get(DAILY_COUNT_KEY + userId);
        return value == null ? 0 : Integer.parseInt(value);
    }

    // 오늘 완료 횟수 +1 (TTL = 자정까지 남은 시간)
    public void incrementDailyCount(Long userId) {
        String key = DAILY_COUNT_KEY + userId;
        redisTemplate.opsForValue().increment(key);
        if (redisTemplate.getExpire(key) < 0) {
            redisTemplate.expire(key, calcTtlUntilMidnight());
        }
    }

    // 자정까지 남은 시간 계산
    private Duration calcTtlUntilMidnight() {
        LocalDateTime now      = LocalDateTime.now();
        LocalDateTime midnight = LocalDate.now().plusDays(1).atTime(LocalTime.MIDNIGHT);
        return Duration.between(now, midnight);
    }
}