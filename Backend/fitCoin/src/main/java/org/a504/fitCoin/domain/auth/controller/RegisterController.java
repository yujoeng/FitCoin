package org.a504.fitCoin.domain.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyConfirmRequest;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyRequest;
import org.a504.fitCoin.domain.auth.dto.request.RegisterRequest;
import org.a504.fitCoin.domain.auth.dto.response.EmailVerifyConfirmResponse;
import org.a504.fitCoin.domain.auth.service.RegisterService;
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
public class RegisterController {

    private final RegisterService registerService;

    @PostMapping("/email-verifications")
    public ResponseEntity<ApiResponse<Void>> sendVerificationCode(@Valid @RequestBody EmailVerifyRequest request) {
        registerService.sendVerificationCode(request);
        return ApiResponse.onSuccess(SuccessStatus.OK);
    }

    @PostMapping("/email-verifications/confirm")
    public ResponseEntity<ApiResponse<EmailVerifyConfirmResponse>> verifyEmail(@Valid @RequestBody EmailVerifyConfirmRequest request) {
        EmailVerifyConfirmResponse response = registerService.verifyEmail(request);
        return ApiResponse.onSuccess(SuccessStatus.OK, response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        registerService.register(request);
        return ApiResponse.onSuccess(SuccessStatus.CREATED);
    }
}
