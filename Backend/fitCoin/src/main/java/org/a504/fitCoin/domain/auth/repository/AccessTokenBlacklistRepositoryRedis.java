package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class AccessTokenBlacklistRepositoryRedis implements AccessTokenBlacklistRepository {

    private static final String KEY_PREFIX = "BL:";
    private final StringRedisTemplate redisTemplate;

    @Override
    public void save(String accessToken, long expiredInMs) {
        String key = KEY_PREFIX + accessToken;
        redisTemplate.opsForValue().set(key, "logout", expiredInMs, TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean exists(String accessToken) {
        return redisTemplate.hasKey(KEY_PREFIX + accessToken);
    }
}