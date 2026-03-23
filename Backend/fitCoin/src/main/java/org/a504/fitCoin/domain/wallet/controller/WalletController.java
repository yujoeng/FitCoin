package org.a504.fitCoin.domain.wallet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.wallet.dto.WalletResponseDto;
import org.a504.fitCoin.domain.wallet.service.WalletService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wallet")
@Tag(name = "Wallet")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("")
    @Operation(summary = "보유 기프티콘 조회", description = "로그인한 유저의 기프티콘 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<WalletResponseDto>> getMyGifticons(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUserId();
        WalletResponseDto result = walletService.getMyGifticons(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

}