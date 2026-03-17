package org.a504.fitCoin.domain.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.dto.LoginDto;
import org.a504.fitCoin.domain.auth.dto.request.LoginRequest;
import org.a504.fitCoin.domain.auth.dto.response.LoginResponse;
import org.a504.fitCoin.domain.auth.service.AuthService;
import org.a504.fitCoin.domain.auth.util.CookieUtil;
import org.a504.fitCoin.global.config.property.CookieProperties;
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
    private final CookieProperties cookieProperties;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {

        LoginDto loginDto = authService.login(request);

        response.setHeader("Authorization", "Bearer " + loginDto.accessToken());
        response.addCookie(CookieUtil.createCookie("refresh", loginDto.refreshToken(), cookieProperties.getMaxAge()));

        return ApiResponse.onSuccess(SuccessStatus.OK, new LoginResponse(loginDto.accessToken()));
    }
}