package org.a504.fitCoin.domain.asset.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
import org.a504.fitCoin.domain.asset.service.ExchangeRateService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExchangeRateInitializer {

    private final ExchangeJpaRepository exchangeJpaRepository;
    private final ExchangeRateService exchangeRateService;

    @EventListener(ApplicationReadyEvent.class)
    public void initTodayExchangeRate() {
        if (exchangeJpaRepository.findByBaseDate(LocalDate.now()).isPresent()) {
            log.info("오늘 환율이 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }
        log.info("오늘 환율이 없습니다. 환율 계산을 시작합니다.");
        exchangeRateService.calculate();
    }
}
