package org.a504.fitCoin.domain.character.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.character.dto.response.AdoptCharacterResponse;
import org.a504.fitCoin.domain.character.dto.response.CharacterResponse;
import org.a504.fitCoin.domain.character.service.CharacterService;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/characters")
@Tag(name = "Character")
public class CharacterController {

    private final CharacterService characterService;

    @Operation(summary = "캐릭터 입양(뽑기)")
    @PostMapping("/adopt")
    public ResponseEntity<ApiResponse<AdoptCharacterResponse>> adoptCharacter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        AdoptCharacterResponse response = characterService.adoptCharacter(userId);
        return ApiResponse.onSuccess(SuccessStatus.CREATED, response);
    }

    @Operation(summary = "현재 캐릭터 조회")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CharacterResponse>> getMyCharacter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        CharacterResponse response = characterService.getMyCharacter(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

}