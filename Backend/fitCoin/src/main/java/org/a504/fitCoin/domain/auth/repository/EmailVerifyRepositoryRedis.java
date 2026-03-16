package org.a504.fitCoin.domain.auth.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class EmailVerifyRepositoryRedis implements EmailVerifyRepository {

    private final StringRedisTemplate redisTemplate;

    @Value("${email.expired-time}")
    private Long emailExpiredTime;

    @Override
    public void saveVerificationCode(String email, String code) {
        String key = "verify:code:" + email;
        redisTemplate.opsForValue().set(key, code, emailExpiredTime, TimeUnit.MILLISECONDS);
    }
}
