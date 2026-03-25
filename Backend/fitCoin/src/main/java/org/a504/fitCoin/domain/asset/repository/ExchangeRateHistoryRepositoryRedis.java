package org.a504.fitCoin.domain.asset.repository;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.dto.response.ExchangeRateHistoryResponse;
import org.a504.fitCoin.global.config.property.ExchangeCacheProperties;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class ExchangeRateHistoryRepositoryRedis implements ExchangeRateHistoryRepository {

    private static final String KEY = "exchange-rate:history";
    private final ExchangeCacheProperties exchangeCacheProperties;
    private final StringRedisTemplate redisTemplate;

    public boolean exists() {
        return redisTemplate.hasKey(KEY);
    }

    @SuppressWarnings("unchecked")
    public void addAll(List<ExchangeRateHistoryResponse> entries) {
        redisTemplate.execute(new SessionCallback<>() {
            @Override
            public Object execute(RedisOperations operations) {
                operations.multi();
                operations.delete(KEY);
                for (ExchangeRateHistoryResponse entry : entries) {
                    operations.opsForZSet().add(KEY, entry.timestamp() + ":" + entry.rate(), entry.timestamp());
                }
                operations.expire(KEY, exchangeCacheProperties.getExpiredTime(), TimeUnit.MILLISECONDS);
                return operations.exec();
            }
        });
    }

    public void delete() {
        redisTemplate.delete(KEY);
    }

    public List<ExchangeRateHistoryResponse> getAll() {
        Set<ZSetOperations.TypedTuple<String>> tuples =
                redisTemplate.opsForZSet().rangeWithScores(KEY, 0, -1);

        if (tuples == null) return List.of();

        redisTemplate.expire(KEY, exchangeCacheProperties.getExpiredTime(), TimeUnit.MILLISECONDS);

        List<ExchangeRateHistoryResponse> result = new ArrayList<>();
        for (ZSetOperations.TypedTuple<String> tuple : tuples) {
            String[] parts = tuple.getValue().split(":");
            long timestamp = Long.parseLong(parts[0]);
            int parsedRate = Integer.parseInt(parts[1]);
            result.add(new ExchangeRateHistoryResponse(timestamp, parsedRate));
        }
        return result;
    }
}