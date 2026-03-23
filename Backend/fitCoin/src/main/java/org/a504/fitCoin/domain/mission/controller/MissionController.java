package org.a504.fitCoin.domain.mission.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.mission.dto.*;
import org.a504.fitCoin.domain.mission.service.MissionService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/missions")
@Tag(name = "Mission")
public class MissionController {

    private final MissionService missionService;

    @Operation(summary = "미션 시작",
            description = "선택한 미션을 시작합니다. 응답으로 받은 missionToken을 미션 완료 API 요청 시 사용합니다.")
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<MissionStartResponse>> startMission(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody MissionStartRequest request
    ) {
        MissionStartResponse result = missionService.startMission(userDetails.getUserId(), request);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

    @Operation(summary = "미션 완료",
            description = "미션 완료 처리를 요청합니다. 완료 시각을 포함해야 합니다.")
    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<MissionCompleteResponse>> completeMission(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody MissionCompleteRequest request
    ) {
        MissionCompleteResponse result = missionService.completeMission(userDetails.getUserId(), request);
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

    @Operation(summary = "미션 후보 목록 조회",
            description = "수행 가능한 전체 미션 목록을 조회합니다. 미션 시작 시 필요한 미션 ID를 이 API에서 얻습니다.")
    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<MissionCandidateListResponse>> getMissionCandidates() {
        MissionCandidateListResponse result = missionService.getMissionCandidates();
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }

    @Operation(summary = "미션 수행 가능 여부 조회",
            description = "사용자의 오늘 미션 수행 가능 여부를 조회합니다. 하루 최대 3회 수행 가능하며 00시에 초기화됩니다.")
    @PostMapping("/availability")
    public ResponseEntity<ApiResponse<MissionAvailabilityResponse>> getMissionAvailability(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        MissionAvailabilityResponse result = missionService.getMissionAvailability(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK, result);
    }
}