package org.a504.fitCoin.domain.room.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.room.dto.request.RoomLayoutRequest;
import org.a504.fitCoin.domain.room.dto.response.RoomLayoutResponse;
import org.a504.fitCoin.domain.room.dto.response.RoomLayoutUpdateResponse;
import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.exception.RoomErrorStatus;
import org.a504.fitCoin.domain.room.repository.FurnitureJpaRepository;
import org.a504.fitCoin.domain.user.dto.response.UserFurnitureResponse;
import org.a504.fitCoin.domain.user.entity.UserFurniture;
import org.a504.fitCoin.domain.user.entity.UserRoom;
import org.a504.fitCoin.domain.user.repository.UserFurnitureJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserRoomJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final UserRoomJpaRepository userRoomJpaRepository;
    private final FurnitureJpaRepository furnitureJpaRepository;
    private final UserFurnitureJpaRepository userFurnitureJpaRepository;

    @Transactional(readOnly = true)
    public RoomLayoutResponse getRoomLayout(Long userId) {
        UserRoom userRoom = userRoomJpaRepository.findByUserIdWithFurnitures(userId)
                .orElseThrow(() -> new CustomException(RoomErrorStatus.ROOM_NOT_FOUND));
        return RoomLayoutResponse.from(userRoom);
    }

    @Transactional(readOnly = true)
    public UserFurnitureResponse getInventory(Long userId) {
        List<UserFurniture> inventories = userFurnitureJpaRepository.findAllByUserIdWithFurniture(userId);
        return UserFurnitureResponse.from(inventories);
    }

    @Transactional
    public RoomLayoutUpdateResponse updateRoomLayout(Long userId, RoomLayoutRequest request) {

        UserRoom userRoom = userRoomJpaRepository.findByUserIdWithFurnitures(userId)
                .orElseThrow(() -> new CustomException(RoomErrorStatus.ROOM_NOT_FOUND));

        // ID가 null 이면 null(배치 해제), 아니면 DB에서 가구 조회
        Furniture wallItem   = findAndValidate(userId, request.wallpaperId());
        Furniture floorItem  = findAndValidate(userId, request.floorId());
        Furniture windowItem = findAndValidate(userId, request.windowId());
        Furniture leftItem   = findAndValidate(userId, request.leftId());
        Furniture rightItem  = findAndValidate(userId, request.rightId());
        Furniture hiddenItem = findAndValidate(userId, request.decorationId());

        userRoom.updateLayout(wallItem, floorItem, windowItem, leftItem, rightItem, hiddenItem);

        return RoomLayoutUpdateResponse.from(userRoom);
    }

    // 가구 ID가 null 이면 null 반환, 아니면 DB에서 조회
    private Furniture findAndValidate(Long userId, Long furnitureId) {
        if (furnitureId == null) return null;

        Furniture furniture = furnitureJpaRepository.findById(furnitureId)
                .orElseThrow(() -> new CustomException(RoomErrorStatus.FURNITURE_NOT_FOUND));

        if (!userFurnitureJpaRepository.existsByUserIdAndFurnitureId(userId, furnitureId)) {
            throw new CustomException(RoomErrorStatus.FURNITURE_NOT_OWNED);
        }

        return furniture;
    }
}