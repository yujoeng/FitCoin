package org.a504.fitCoin.domain.streak.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.streak.dto.MonthlyStreakResponse;
import org.a504.fitCoin.domain.streak.dto.RecentStreakResponse;
import org.a504.fitCoin.domain.streak.service.StreakService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/streak")
@Tag(name = "Streak")
public class StreakController {

    private final StreakService streakService;

    @Operation(summary = "최근 7일 스트릭 조회",
            description = "사용자의 최근 7일 출석 여부와 현재 연속 스트릭 일수를 조회합니다.")
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<RecentStreakResponse>> getRecentStreak(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        RecentStreakResponse result = streakService.getRecentStreak(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

    @Operation(summary = "월별 스트릭 조회",
            description = "특정 년월의 일별 출석 여부와 현재 연속 스트릭 일수를 조회합니다.")
    @GetMapping("/month")
    public ResponseEntity<ApiResponse<MonthlyStreakResponse>> getMonthlyStreak(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam int year,
            @RequestParam int month
    ) {
        MonthlyStreakResponse result = streakService.getMonthlyStreak(userDetails.getUserId(), year, month);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }
}