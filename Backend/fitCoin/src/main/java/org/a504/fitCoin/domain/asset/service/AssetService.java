package org.a504.fitCoin.domain.asset.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.dto.AssetResponse;
import org.a504.fitCoin.domain.asset.dto.ExchangeRateHistoryResponse;
import org.a504.fitCoin.domain.asset.dto.ExchangeRateResponse;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeRateHistoryRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AssetService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final UserJpaRepository userJpaRepository;
    private final ExchangeJpaRepository exchangeJpaRepository;
    private final ExchangeRateHistoryRepository exchangeRateHistoryRepository;

    public AssetResponse getAsset(Long userId) {

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        return new AssetResponse(user.getPoint(), user.getCoin());
    }

    public ExchangeRateResponse getExchangeRate() {
        return exchangeJpaRepository.findTopByOrderByBaseDateDesc()
                .map(e -> new ExchangeRateResponse(e.getBaseDate(), e.getRate()))
                .orElseThrow(() -> new CustomException(ErrorStatus.EXCHANGE_RATE_NOT_AVAILABLE));
    }

    public List<ExchangeRateHistoryResponse> getHistory() {
        if (exchangeRateHistoryRepository.exists()) {
            List<ExchangeRateHistoryResponse> cached = exchangeRateHistoryRepository.getAll();
            if (!cached.isEmpty()) {
                return cached;
            }
        }

        List<ExchangeRateHistoryResponse> result = exchangeJpaRepository.findAllByOrderByBaseDateAsc()
                .stream()
                .map(exchange -> {
                    long epochSeconds = exchange.getBaseDate().atStartOfDay(KST).toEpochSecond();
                    return new ExchangeRateHistoryResponse(epochSeconds, exchange.getRate());
                })
                .toList();

        exchangeRateHistoryRepository.addAll(result);
        return result;
    }
}
