package org.a504.fitCoin;

import org.a504.fitCoin.global.config.property.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@EnableRetry
@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties({
        CorsConfigProperties.class, JwtProperties.class,
        EmailProperties.class, CookieProperties.class, ExchangeProperties.class
})
public class FitCoinApplication {
    public static void main(String[] args) {
        SpringApplication.run(FitCoinApplication.class, args);
    }
}
