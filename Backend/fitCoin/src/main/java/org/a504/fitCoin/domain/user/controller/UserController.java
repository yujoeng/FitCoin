package org.a504.fitCoin.domain.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.user.dto.request.ExerciseLevelRequest;
import org.a504.fitCoin.domain.user.dto.request.NicknameRequest;
import org.a504.fitCoin.domain.user.dto.response.ExerciseLevelResponse;
import org.a504.fitCoin.domain.user.dto.response.MyPageResponse;
import org.a504.fitCoin.domain.user.dto.response.NicknameResponse;
import org.a504.fitCoin.domain.user.service.UserService;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "User")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MyPageResponse>> mypage(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUserId();
        MyPageResponse response = userService.getMyInfo(userId);
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        userService.deleteUser(userDetails.getUserId());
        return ApiResponse.onSuccess(SuccessStatus.OK);
    }

    @PatchMapping("/me/nickname")
    public ResponseEntity<ApiResponse<NicknameResponse>> changeNickname(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody NicknameRequest request
    ) {

        String nickname = request.nickname();
        userService.changeNickname(userDetails.getUserId(), nickname);
        return ApiResponse.onSuccess(SuccessStatus.OK, new NicknameResponse(nickname));
    }

    @PatchMapping("/me/exercise-level")
    public ResponseEntity<ApiResponse<ExerciseLevelResponse>> changeExerciseLevel(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ExerciseLevelRequest request
    ) {

        ExerciseLevel exerciseLevel = request.exerciseLevel();
        userService.changeExerciseLevel(userDetails.getUserId(), exerciseLevel);
        return ApiResponse.onSuccess(SuccessStatus.OK, new ExerciseLevelResponse(exerciseLevel));
    }
}