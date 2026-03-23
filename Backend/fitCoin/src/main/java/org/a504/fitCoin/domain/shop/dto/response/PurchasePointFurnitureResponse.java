package org.a504.fitCoin.domain.shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

public record PurchasePointFurnitureResponse(
        int spentPoint,
        int remainingPoint,
        AcquiredFurnitureInfo acquiredFurniture,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        AcquiredFurnitureInfo unlockedHiddenFurniture
) {
}
