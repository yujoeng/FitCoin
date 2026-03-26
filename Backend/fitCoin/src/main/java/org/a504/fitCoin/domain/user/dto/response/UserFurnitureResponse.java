package org.a504.fitCoin.domain.user.dto.response;

import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.a504.fitCoin.domain.user.entity.UserFurniture;

import java.util.List;

public record UserFurnitureResponse(
        List<FurnitureInfo> furnitures
) {
    public record FurnitureInfo(
            Long furnitureId,
            FurniturePosition furnitureType,
            Long themeId,
            String furnitureName,
            String imageUrl,
            PurchaseType acquireType
    ) {}

    public static UserFurnitureResponse from(List<UserFurniture> inventories) {
        List<FurnitureInfo> furnitures = inventories.stream()
                .map(inventory -> new FurnitureInfo(
                        inventory.getFurniture().getId(),
                        inventory.getFurniture().getPosition(),
                        inventory.getFurniture().getTheme().getId(),
                        inventory.getFurniture().getName(),
                        inventory.getFurniture().getUrl(),
                        inventory.getFurniture().getType()
                ))
                .toList();

        return new UserFurnitureResponse(furnitures);
    }
}