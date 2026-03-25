package org.a504.fitCoin.domain.asset.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.dto.request.ExchangeRequest;
import org.a504.fitCoin.domain.asset.dto.response.AssetResponse;
import org.a504.fitCoin.domain.asset.dto.response.ExchangeRateHistoryResponse;
import org.a504.fitCoin.domain.asset.dto.response.ExchangeRateResponse;
import org.a504.fitCoin.domain.asset.dto.response.ExchangeResponse;
import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.a504.fitCoin.domain.asset.entity.PointLog;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeRateHistoryRepository;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.asset.value.TransactionType;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AssetService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final UserJpaRepository userJpaRepository;
    private final ExchangeJpaRepository exchangeJpaRepository;
    private final ExchangeRateHistoryRepository exchangeRateHistoryRepository;
    private final PointLogJpaRepository pointLogJpaRepository;
    private final CoinLogJpaRepository coinLogJpaRepository;

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

    public ExchangeResponse exchange(Long userId, ExchangeRequest request) {

        int rate = request.rate();
        exchangeJpaRepository.findTopByOrderByBaseDateDesc()
                .filter(e -> e.getRate() == rate)
                .orElseThrow(() -> {
                    return new CustomException(ErrorStatus.EXCHANGE_RATE_CHANGED);
                });
        int exchangePoint = request.point();

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        if (exchangePoint % rate != 0) {
            log.warn("교환 가능한 포인트 단위가 아닙니다.");
            throw new CustomException(ErrorStatus.INVALID_EXCHANGE_AMOUNT);
        }

        if (user.getPoint() < exchangePoint) {
            log.warn("보유 포인트가 적습니다. 보유포인트={}, 교환요청포인트={}", user.getPoint(), exchangePoint);
            throw new CustomException(ErrorStatus.INSUFFICIENT_POINT);
        }

        int exchangeCoin = exchangePoint / rate;

        user.deductPoint(exchangePoint);
        PointLog savedPointLog = pointLogJpaRepository.save(PointLog.of(user, exchangePoint, TransactionType.USE));
        user.addCoin(exchangeCoin);
        CoinLog savedCoinLog = coinLogJpaRepository.save(CoinLog.of(user, exchangeCoin, TransactionType.EARN));

        return new ExchangeResponse(savedPointLog.getAmount(), savedCoinLog.getAmount(), rate);
    }
}
