package org.a504.fitCoin.domain.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyRequest;
import org.a504.fitCoin.domain.auth.service.AuthService;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/email-verifications")
    public ResponseEntity<ApiResponse<Void>> emailVerification(@Valid @RequestBody EmailVerifyRequest request) {
        authService.sendVerificationCode(request);
        return ApiResponse.onSuccess(SuccessStatus.OK);
    }
}