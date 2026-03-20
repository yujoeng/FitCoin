package org.a504.fitCoin.domain.room.dto.response;

import org.a504.fitCoin.domain.user.entity.UserRoom;

public record RoomLayoutResponse(
        FurnitureInfo wallpaper,
        FurnitureInfo floor,
        FurnitureInfo window,
        FurnitureInfo left,
        FurnitureInfo right,
        FurnitureInfo hidden
) {

    // 미배치 상태 변환하는 내부 record
    public record FurnitureInfo(
            Long furnitureId,
            String imageUrl
    ) {}

    // UserRoom 받아 DTO 변환
    public static RoomLayoutResponse from(UserRoom userRoom) {
        return new RoomLayoutResponse(
                toInfo(userRoom.getWallItem()),
                toInfo(userRoom.getFloorItem()),
                toInfo(userRoom.getWindowItem()),
                toInfo(userRoom.getLeftItem()),
                toInfo(userRoom.getRightItem()),
                toInfo(userRoom.getHiddenItem())
        );
    }

    private static FurnitureInfo toInfo(org.a504.fitCoin.domain.room.entity.Furniture furniture) {
        if (furniture == null) return null;
        return new FurnitureInfo(furniture.getId(), furniture.getUrl());
    }
}