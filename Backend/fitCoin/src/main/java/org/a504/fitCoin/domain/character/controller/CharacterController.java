package org.a504.fitCoin.domain.character.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.character.dto.response.AdoptCharacterResponse;
import org.a504.fitCoin.domain.character.dto.response.CharacterDexResponse;
import org.a504.fitCoin.domain.character.dto.response.CharacterResponse;
import org.a504.fitCoin.domain.character.service.CharacterService;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/characters")
@Tag(name = "Character")
public class CharacterController {

    private final CharacterService characterService;

    @Operation(summary = "캐릭터 뽑기", description = "새로운 캐릭터를 데려옵니다.")
    @PostMapping("/adopt")
    public ResponseEntity<ApiResponse<AdoptCharacterResponse>> adoptCharacter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        AdoptCharacterResponse response = characterService.adoptCharacter(userId);
        return ApiResponse.onSuccess(SuccessStatus.CREATED, response);
    }

    @Operation(summary = "현재 캐릭터 정보 조회", description = "사용자가 현재 성장시키고 있는 캐릭터의 정보(캐릭터 종류, 경험치 등)를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CharacterResponse>> getMyCharacter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        CharacterResponse response = characterService.getMyCharacter(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @Operation(summary = "캐릭터 졸업", description = "현재 캐릭터가 졸업이 가능한 상태일 경우, 졸업 로직을 트리거합니다. 기프티콘을 지급합니다. 캐릭터를 도감에 추가합니다.")
    @PatchMapping("/graduate")
    public ResponseEntity<ApiResponse<Void>> graduateCharacter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        characterService.graduateCharacter(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK);
    }

    @Operation(summary = "캐릭터 도감 조회", description = "캐릭터 도감의 상태를 조회합니다.")
    @GetMapping("/dex")
    public ResponseEntity<ApiResponse<List<CharacterDexResponse>>> getCharacterDex(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        List<CharacterDexResponse> response = characterService.getCharacterDex(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

}