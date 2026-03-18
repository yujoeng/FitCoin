package org.a504.fitCoin.domain.advertisement.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdInProgressRepositoryRedis implements AdInProgressRepository {

    private static final String KEY_PREFIX = "ad:inProgress:";
    private static final Duration TTL = Duration.ofMinutes(5);

    private final StringRedisTemplate redisTemplate;

    @Override
    public boolean exists(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_PREFIX + userId));
    }

    @Override
    public void save(Long userId, Instant startedAt) {
        redisTemplate.opsForValue().set(KEY_PREFIX + userId, String.valueOf(startedAt.toEpochMilli()), TTL);
    }

    @Override
    public Optional<Instant> getAndDelete(Long userId) {
        String key = KEY_PREFIX + userId;
        String value = redisTemplate.opsForValue().getAndDelete(key);
        if (value == null) {
            return Optional.empty();
        }
        return Optional.of(Instant.ofEpochMilli(Long.parseLong(value)));
    }
}
