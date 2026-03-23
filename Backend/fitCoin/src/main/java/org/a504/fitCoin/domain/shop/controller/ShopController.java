package org.a504.fitCoin.domain.shop.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchasePointFurnitureResponse;
import org.a504.fitCoin.domain.shop.service.ShopService;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shop")
@Tag(name = "Shop")
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/items")
    @Operation(summary = "상점 아이템 목록 조회", description = "상점에서 판매하는 아이템 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<GetItemsResponse>> getItems() {
        return ApiResponse.onSuccess(SuccessStatus.OK, shopService.getItems());
    }

    @PostMapping("/gacha/furniture/point")
    @Operation(summary = "포인트 가구 랜덤 뽑기", description = "포인트를 소비하여 가구를 랜덤으로 획득합니다. 테마가 완성되면 히든 가구가 자동으로 지급됩니다.")
    public ResponseEntity<ApiResponse<PurchasePointFurnitureResponse>> purchasePointFurniture(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.onSuccess(SuccessStatus.OK,
                shopService.purchasePointFurniture(userDetails.getUserId()));
    }
}
