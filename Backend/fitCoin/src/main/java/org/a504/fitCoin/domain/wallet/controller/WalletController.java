package org.a504.fitCoin.domain.wallet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.wallet.dto.WalletResponseDto;
import org.a504.fitCoin.domain.wallet.service.WalletService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<List<WalletResponseDto>>> getMyGifticons() {

        // TODO: user 도메인 담당자와 협의 후 JWT에서 userId 추출하는 방식으로 교체
        Long userId = 1L; // 임시값 — 반드시 교체 필요!

        List<WalletResponseDto> result = walletService.getMyGifticons(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

}