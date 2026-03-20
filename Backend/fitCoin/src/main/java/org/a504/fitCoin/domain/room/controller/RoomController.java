package org.a504.fitCoin.domain.room.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.room.dto.request.RoomLayoutRequest;
import org.a504.fitCoin.domain.room.dto.response.RoomLayoutResponse;
import org.a504.fitCoin.domain.room.dto.response.RoomLayoutUpdateResponse;
import org.a504.fitCoin.domain.room.exception.RoomSuccessStatus;
import org.a504.fitCoin.domain.room.service.RoomService;
import org.a504.fitCoin.domain.user.dto.response.InventoryResponse;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
@Tag(name = "Room")
public class RoomController {

    private final RoomService roomService;

    @GetMapping("")
    @Operation(summary = "방 상태 조회", description = "사용자의 현재 가구 배치 상태를 조회합니다.")
    public ResponseEntity<ApiResponse<RoomLayoutResponse>> getRoomLayout(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RoomLayoutResponse response = roomService.getRoomLayout(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @GetMapping("/inventory")
    @Operation(summary = "가구 인벤토리 조회", description = "사용자의 가구 보유 상태를 조회합니다.")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        InventoryResponse response = roomService.getInventory(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @PutMapping("")
    @Operation(summary = "가구 배치 상태 변경", description = "변경할 가구 배치 상태를 입력받아, 사용자의 현재 가구 배치 상태를 변경합니다.")
    public ResponseEntity<ApiResponse<RoomLayoutUpdateResponse>> updateRoomLayout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody RoomLayoutRequest request
    ) {
        RoomLayoutUpdateResponse response = roomService.updateRoomLayout(userDetails.getUserId(), request);
        return ApiResponse.onSuccess(RoomSuccessStatus.ROOM_LAYOUT_UPDATED, response);
    }
}