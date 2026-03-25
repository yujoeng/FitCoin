package org.a504.fitCoin.domain.asset.dto;

public record ExchangeRateHistoryResponse(
        long timestamp,
        int rate
) {
}