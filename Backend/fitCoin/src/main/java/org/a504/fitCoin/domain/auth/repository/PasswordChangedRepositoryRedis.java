package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.config.property.JwtProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class PasswordChangedRepositoryRedis implements PasswordChangedRepository {

    private static final String KEY_PREFIX = "PC:";

    private final StringRedisTemplate redisTemplate;
    private final JwtProperties jwtProperties;

    @Override
    public void save(String email, long changedAtMs) {
        String key = KEY_PREFIX + email;
        redisTemplate.opsForValue().set(key, String.valueOf(changedAtMs),
                jwtProperties.getAccessTokenValidity(), TimeUnit.MILLISECONDS);
    }

    @Override
    public Optional<Long> findChangedAt(String email) {
        String value = redisTemplate.opsForValue().get(KEY_PREFIX + email);
        return Optional.ofNullable(value).map(Long::parseLong);
    }
}