package org.a504.fitCoin.global.config.property;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "exchange")
public class ExchangeProperties {

    private double initialEwma;
    private double lambda;
    private double k;
    private double upperPct;
    private double lowerPct;
    private int absFloor;
    private int smoothMin;
}