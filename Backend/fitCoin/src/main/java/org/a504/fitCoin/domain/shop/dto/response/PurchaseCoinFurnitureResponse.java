package org.a504.fitCoin.domain.shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

public record PurchaseCoinFurnitureResponse(
        int spentCoin,
        int remainingCoin,
        AcquiredFurnitureInfo acquiredFurniture,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        AcquiredFurnitureInfo unlockedHiddenFurniture
) {
}