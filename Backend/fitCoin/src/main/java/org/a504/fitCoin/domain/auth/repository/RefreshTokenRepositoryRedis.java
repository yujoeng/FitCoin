package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.global.config.property.JwtProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Slf4j
@Repository
@RequiredArgsConstructor
public class RefreshTokenRepositoryRedis implements RefreshTokenRepository {


    private static final String KEY_PREFIX = "RT:";
    private final StringRedisTemplate redisTemplate;
    private final JwtProperties jwtProperties;

    @Override
    public void save(String email, String identifier, String refreshToken) {
        String key = KEY_PREFIX + email + ":" + identifier;
        redisTemplate.opsForValue().set(key, refreshToken, jwtProperties.getRefreshTokenValidity(), TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean exists(String email, String identifier, String refreshToken) {
        String key = KEY_PREFIX + email + ":" + identifier;
        String value = redisTemplate.opsForValue().get(key);
        return refreshToken.equals(value);
    }

    @Override
    public void delete(String email, String identifier) {
        String key = KEY_PREFIX + email + ":" + identifier;
        redisTemplate.delete(key);
    }
}
