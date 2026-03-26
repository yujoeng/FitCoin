package org.a504.fitCoin.domain.user.dto.response;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.a504.fitCoin.domain.user.entity.UserFurniture;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record UserFurnitureResponse(
        List<FurnitureInfo> furnitures
) {
    public record FurnitureInfo(
            Long furnitureId,
            FurniturePosition furnitureType,
            Long themeId,
            String furnitureName,
            String imageUrl,
            PurchaseType acquireType,
            boolean owned
    ) {}

    public static UserFurnitureResponse from(List<Furniture> allFurnitures, List<UserFurniture> inventories) {
        Set<Long> ownedIds = inventories.stream()
                .map(uf -> uf.getFurniture().getId())
                .collect(Collectors.toSet());

        List<FurnitureInfo> furnitures = allFurnitures.stream()
                .map(f -> new FurnitureInfo(
                        f.getId(),
                        f.getPosition(),
                        f.getTheme().getId(),
                        f.getName(),
                        f.getUrl(),
                        f.getType(),
                        ownedIds.contains(f.getId())  // 보유 여부
                ))
                .toList();

        return new UserFurnitureResponse(furnitures);
    }
}