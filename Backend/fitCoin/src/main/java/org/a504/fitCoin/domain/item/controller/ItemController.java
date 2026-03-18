package org.a504.fitCoin.domain.item.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.item.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.item.service.ItemService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
@Tag(name = "Item")
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @Operation(summary = "상점 아이템 목록 조회", description = "상점에서 판매하는 아이템 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<GetItemsResponse>> getItems() {
        return ApiResponse.onSuccess(SuccessStatus.OK, itemService.getItems());
    }
}