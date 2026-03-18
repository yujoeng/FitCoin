package org.a504.fitCoin.domain.advertisement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.service.AdvertisementService;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ads")
@Tag(name = "Advertisement")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @PostMapping("/start")
    @Operation(summary = "광고 시청 시작", description = "광고 시청을 시작합니다. 당일 이미 시청했거나 진행 중인 시청이 있으면 에러를 반환합니다.")
    public ResponseEntity<ApiResponse<StartAdResponse>> startAd(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        StartAdResponse response = advertisementService.startAd(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }
}
