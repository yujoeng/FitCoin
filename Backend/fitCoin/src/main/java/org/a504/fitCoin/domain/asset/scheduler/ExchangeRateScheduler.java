package org.a504.fitCoin.domain.asset.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.asset.service.ExchangeRateService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExchangeRateScheduler {

    private final ExchangeRateService exchangeRateService;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void calculate() {
        log.info("Exchange rate calculation started.");
        exchangeRateService.calculate();
        log.info("Exchange rate calculation completed.");
    }
}
