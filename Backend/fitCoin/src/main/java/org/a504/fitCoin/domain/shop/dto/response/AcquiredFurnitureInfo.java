package org.a504.fitCoin.domain.shop.dto.response;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.value.FurniturePosition;

public record AcquiredFurnitureInfo(
        Long furnitureId,
        FurniturePosition position,
        Long themeId,
        String furnitureName,
        String imageUrl,
        boolean isNewAcquired
) {
    public static AcquiredFurnitureInfo of(Furniture furniture, boolean isNewAcquired) {
        return new AcquiredFurnitureInfo(
                furniture.getId(),
                furniture.getPosition(),
                furniture.getTheme().getId(),
                furniture.getName(),
                furniture.getUrl(),
                isNewAcquired
        );
    }
}
