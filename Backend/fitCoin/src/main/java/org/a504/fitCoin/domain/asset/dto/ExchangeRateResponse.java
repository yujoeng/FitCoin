package org.a504.fitCoin.domain.asset.dto;

import java.time.LocalDate;

public record ExchangeRateResponse(
        LocalDate date,
        int rate
) {
}
