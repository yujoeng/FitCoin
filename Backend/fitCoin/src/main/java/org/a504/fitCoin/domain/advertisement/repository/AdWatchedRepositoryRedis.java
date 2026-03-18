package org.a504.fitCoin.domain.advertisement.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Repository
@RequiredArgsConstructor
public class AdWatchedRepositoryRedis implements AdWatchedRepository {

    private static final String KEY_PREFIX = "ad:watched:";
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final StringRedisTemplate redisTemplate;

    @Override
    public boolean exists(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_PREFIX + userId));
    }

    @Override
    public void save(Long userId) {
        LocalDateTime now = LocalDateTime.now(KST);
        LocalDateTime midnight = LocalDate.now(KST).plusDays(1).atStartOfDay();
        Duration ttl = Duration.between(now, midnight);
        redisTemplate.opsForValue().set(KEY_PREFIX + userId, "1", ttl);
    }
}
