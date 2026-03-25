package org.a504.fitCoin.domain.asset.dto.response;

public record ExchangeRateHistoryResponse(
        long timestamp,
        int rate
) {
}