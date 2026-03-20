package org.a504.fitCoin.domain.room.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.a504.fitCoin.domain.user.entity.UserRoom;

public record RoomLayoutUpdateResponse(
        @JsonProperty("room") RoomInfo room
) {
    public record RoomInfo(
            Long wallpaper,
            Long floor,
            Long window,
            Long left,
            Long right,
            Long hidden
    ) {}

    public static RoomLayoutUpdateResponse from(UserRoom userRoom) {
        return new RoomLayoutUpdateResponse(
                new RoomInfo(
                        userRoom.getWallItem() != null ? userRoom.getWallItem().getId() : null,
                        userRoom.getFloorItem() != null ? userRoom.getFloorItem().getId() : null,
                        userRoom.getWindowItem() != null ? userRoom.getWindowItem().getId() : null,
                        userRoom.getLeftItem() != null ? userRoom.getLeftItem().getId() : null,
                        userRoom.getRightItem() != null ? userRoom.getRightItem().getId() : null,
                        userRoom.getHiddenItem() != null ? userRoom.getHiddenItem().getId() : null
                )
        );
    }
}