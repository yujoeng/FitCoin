package org.a504.fitCoin.domain.room.dto.request;

// 클라이언트에서 받는 가구 배치 변경 요청 DTO
// null 허용 = 해당 위치 배치 해제
public record RoomLayoutRequest(
        Long wallpaperId,
        Long floorId,
        Long windowId,
        Long leftId,
        Long rightId,
        Long decorationId
) {}