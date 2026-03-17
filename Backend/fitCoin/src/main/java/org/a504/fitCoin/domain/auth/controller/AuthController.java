package org.a504.fitCoin.domain.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.dto.JwtDto;
import org.a504.fitCoin.domain.auth.dto.request.LoginRequest;
import org.a504.fitCoin.domain.auth.dto.response.JwtResponse;
import org.a504.fitCoin.domain.auth.service.AuthService;
import org.a504.fitCoin.domain.auth.util.CookieUtil;
import org.a504.fitCoin.global.config.property.CookieProperties;
import org.a504.fitCoin.global.response.ApiResponse;
import org.a504.fitCoin.global.response.status.SuccessStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Auth")
public class AuthController {

    private final AuthService authService;
    private final CookieProperties cookieProperties;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {

        JwtDto jwtDto = authService.login(request);

        response.setHeader("Authorization", "Bearer " + jwtDto.accessToken());
        response.addCookie(CookieUtil.createCookie("refresh", jwtDto.refreshToken(), cookieProperties.getMaxAge()));

        return ApiResponse.onSuccess(SuccessStatus.OK, new JwtResponse(jwtDto.accessToken()));
    }

    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<JwtResponse>> reissue(@CookieValue("refresh") String refreshToken, HttpServletResponse response) {

        JwtDto jwtDto = authService.reissue(refreshToken);

        response.setHeader("Authorization", "Bearer " + jwtDto.accessToken());
        response.addCookie(CookieUtil.createCookie("refresh", jwtDto.refreshToken(), cookieProperties.getMaxAge()));

        return ApiResponse.onSuccess(SuccessStatus.OK, new JwtResponse(jwtDto.accessToken()));
    }
}