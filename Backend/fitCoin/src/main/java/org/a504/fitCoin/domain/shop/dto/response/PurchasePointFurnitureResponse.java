package org.a504.fitCoin.domain.shop.dto.response;

public record PurchasePointFurnitureResponse(
        int spentPoint,
        int remainingPoint,
        AcquiredFurnitureInfo acquiredFurniture,
        AcquiredFurnitureInfo unlockedHiddenFurniture
) {
}
