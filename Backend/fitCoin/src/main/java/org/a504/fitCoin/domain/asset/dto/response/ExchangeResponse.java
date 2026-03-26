package org.a504.fitCoin.domain.asset.dto.response;

public record ExchangeResponse(
        int usedPoint,
        int receivedCoin,
        int rate
) {
}
