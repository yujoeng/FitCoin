package org.a504.fitCoin.global.config.property;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "exchange-cache")
@Getter
@Setter
public class ExchangeCacheProperties {
    private Long expiredTime;
}
