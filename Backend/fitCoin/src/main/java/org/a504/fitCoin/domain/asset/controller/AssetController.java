package org.a504.fitCoin.domain.asset.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.dto.AssetResponse;
import org.a504.fitCoin.domain.asset.dto.ExchangeRateHistoryResponse;
import org.a504.fitCoin.domain.asset.dto.ExchangeRateResponse;
import org.a504.fitCoin.domain.asset.service.AssetService;
import org.a504.fitCoin.domain.asset.service.ExchangeRateService;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assets")
@Tag(name = "Asset")
public class AssetController {

    private final AssetService assetService;
    private final ExchangeRateService exchangeRateService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AssetResponse>> myAsset(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        AssetResponse response = assetService.getAsset(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @GetMapping("/exchange-rate")
    public ResponseEntity<ApiResponse<ExchangeRateResponse>> getExchangeRate() {
        return ApiResponse.onSuccess(SuccessStatus.OK, assetService.getExchangeRate());
    }

    @GetMapping("/exchange-rate/history")
    public ResponseEntity<ApiResponse<List<ExchangeRateHistoryResponse>>> getExchangeRateHistory() {
        return ApiResponse.onSuccess(SuccessStatus.OK, assetService.getHistory());
    }
}