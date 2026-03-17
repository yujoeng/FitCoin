package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.global.config.property.EmailProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class EmailVerifyRepositoryRedis implements EmailVerifyRepository {

    private final StringRedisTemplate redisTemplate;
    private final EmailProperties emailProperties;

    @Override
    public void saveVerificationCode(String email, String code) {
        String key = "verify:code:" + email;
        redisTemplate.opsForValue().set(key, code, emailProperties.getCode().getExpiredTime(), TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean existsVerificationCode(String email, String code) {
        String key = "verify:code:" + email;
        String value = redisTemplate.opsForValue().get(key);
        if (code.equals(value)) return true;
        return false;
    }

    @Override
    public void deleteVerificationCode(String email) {
        String key = "verify:code:" + email;
        redisTemplate.delete(key);
    }

    @Override
    public void saveVerificationToken(String email, String token) {
        String key = "verify:token:" + email;
        redisTemplate.opsForValue().set(key, token, emailProperties.getToken().getExpiredTime(), TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean existsVerificationToken(String email, String token) {
        String key = "verify:token:" + email;
        String value = redisTemplate.opsForValue().get(key);
        return token.equals(value);
    }

    @Override
    public void deleteVerificationToken(String email) {
        String key = "verify:token:" + email;
        redisTemplate.delete(key);
    }
}
