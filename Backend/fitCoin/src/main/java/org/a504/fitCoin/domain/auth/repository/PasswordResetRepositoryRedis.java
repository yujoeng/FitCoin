package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class PasswordResetRepositoryRedis implements PasswordResetRepository {

    private static final String KEY_PREFIX = "PW:";
    private static final long EXPIRED_TIME_MS = 1800000; // 30분

    private final StringRedisTemplate redisTemplate;

    @Override
    public void save(String token, String email) {
        String key = KEY_PREFIX + token;
        redisTemplate.opsForValue().set(key, email, EXPIRED_TIME_MS, TimeUnit.MILLISECONDS);
    }

    @Override
    public Optional<String> findEmailByToken(String token) {
        String key = KEY_PREFIX + token;
        return Optional.ofNullable(redisTemplate.opsForValue().get(key));
    }

    @Override
    public void delete(String token) {
        redisTemplate.delete(KEY_PREFIX + token);
    }
}