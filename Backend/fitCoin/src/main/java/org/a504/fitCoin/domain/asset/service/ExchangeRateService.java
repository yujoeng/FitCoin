package org.a504.fitCoin.domain.asset.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.entity.Exchange;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeRateHistoryRepository;
import org.a504.fitCoin.domain.asset.value.TransactionType;
import org.a504.fitCoin.global.config.property.ExchangeProperties;
import org.a504.fitCoin.global.util.MailClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ExchangeRateService {

    private final ExchangeProperties properties;
    private final ExchangeJpaRepository exchangeJpaRepository;
    private final CoinLogJpaRepository coinLogJpaRepository;
    private final ExchangeRateHistoryRepository exchangeRateHistoryRepository;
    private final MailClient mailClient;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Retryable(retryFor = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void calculate() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // 1. 어제 EWMA 조회 (없으면 초기값)
        double prevEwma = exchangeJpaRepository.findByBaseDate(yesterday)
                .map(Exchange::getEwma)
                .orElse(properties.getInitialEwma());

        // 2. 오늘 환전 코인 수 집계
        long todayCoins = coinLogJpaRepository.sumAddedCoinsByDate(today, TransactionType.EARN);

        // 3. 현재 환율 조회 (없으면 절대 하한)
        long prevRate = exchangeJpaRepository.findTopByOrderByBaseDateDesc()
                .map(e -> (long) e.getRate())
                .orElse((long) properties.getAbsFloor());

        // 4. SMOOTH 계산
        long smooth = Math.max(properties.getSmoothMin(), Math.round(prevEwma));

        // 5. demandIndex 계산
        double demand = Math.log1p(todayCoins) / Math.log1p(smooth);

        // 6. rawRate 계산
        double raw = prevRate * (1 + properties.getK() * (demand - 1));
        double upper = prevRate * (1 + properties.getUpperPct());
        double lower = Math.max(prevRate * (1 - properties.getLowerPct()),
                properties.getAbsFloor());
        int result = (int) Math.round(Math.min(upper, Math.max(lower, raw)));

        // 7. EWMA 업데이트
        double newEwma = todayCoins * properties.getLambda()
                + prevEwma * (1 - properties.getLambda());

        // 8. 저장
        exchangeJpaRepository.save(Exchange.builder()
                .baseDate(today)
                .rate(result)
                .ewma(newEwma)
                .build());

        // 9. DB 커밋 확정 후 Redis ZSET 업데이트
        registerRedisSyncAfterCommit();
    }

    @Recover
    public void recover(Exception e) {
        LocalDate today = LocalDate.now();
        log.error("환율 계산 3회 모두 실패. 전날 환율로 대체합니다. date={}", today, e);

        int fallbackRate = exchangeJpaRepository.findTopByOrderByBaseDateDesc()
                .map(Exchange::getRate)
                .orElse(properties.getAbsFloor());

        exchangeJpaRepository.save(Exchange.builder()
                .baseDate(today)
                .rate(fallbackRate)
                .ewma(properties.getInitialEwma())
                .build());

        registerRedisSyncAfterCommit();

        mailClient.sendTemplateEmail(
                adminEmail,
                "[FitCoin] 환율 계산 실패 알림",
                "mail-exchange-rate-failure",
                Map.of(
                        "date", today,
                        "fallbackRate", fallbackRate,
                        "errorMessage", e.getMessage()
                )
        );
    }

    private void registerRedisSyncAfterCommit() {
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                exchangeRateHistoryRepository.delete();
            }
        });
    }
}
