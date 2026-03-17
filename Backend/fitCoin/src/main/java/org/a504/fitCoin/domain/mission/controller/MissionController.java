package org.a504.fitCoin.domain.mission.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.mission.dto.MissionAvailabilityResponse;
import org.a504.fitCoin.domain.mission.service.MissionService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/missions")
@Tag(name = "Mission")
public class MissionController {

    private final MissionService missionService;

    @Operation(summary = "미션 수행 가능 여부 조회",
            description = "사용자의 오늘 미션 수행 가능 여부를 조회합니다. 하루 최대 3회 수행 가능하며 00시에 초기화됩니다.")
    @PostMapping("/availability")
    public ResponseEntity<ApiResponse<MissionAvailabilityResponse>> getMissionAvailability() {
        // TODO: Auth 도메인 개발 완료 후 아래 하드코딩 제거하고 @AuthenticationPrincipal CustomUserDetails로 교체
        Long userId = 1L;

        MissionAvailabilityResponse result = missionService.getMissionAvailability(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }
}