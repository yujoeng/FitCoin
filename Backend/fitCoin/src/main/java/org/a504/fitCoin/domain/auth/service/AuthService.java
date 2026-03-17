package org.a504.fitCoin.domain.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.dto.JwtDto;
import org.a504.fitCoin.domain.auth.dto.request.LoginRequest;
import org.a504.fitCoin.domain.auth.jwt.JwtUtil;
import org.a504.fitCoin.domain.auth.repository.RefreshTokenRepository;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public JwtDto login(LoginRequest request) {

        String username = request.email();
        String password = request.password();

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(username, password);

        Authentication authentication = authenticationManager.authenticate(authToken);

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getUsername();
        Long userId = customUserDetails.getUserId();

        String access = jwtUtil.createAccessToken(email, userId);
        String refresh = jwtUtil.createRefreshToken(email, userId);
        refreshTokenRepository.save(email, jwtUtil.getIdentifier(refresh), refresh);

        return new JwtDto(access, refresh);
    }

    public JwtDto reissue(String refreshToken) {

        Claims claims = null;
        try {
            claims = jwtUtil.extractAllClaims(refreshToken);
        } catch (JwtException e) {
            log.error("refresh token error");
            throw new CustomException(ErrorStatus.UNAUTHORIZED);
        }

        String email = claims.get("email", String.class);
        String category = claims.get("category", String.class);
        Long userId = claims.get("userId", Long.class);
        String identifier = claims.get("identifier", String.class);

        if (!"refresh".equals(category)) {
            log.error("Invalid refresh token");
            throw new CustomException(ErrorStatus.UNAUTHORIZED);
        }

        if (!refreshTokenRepository.exists(email, identifier, refreshToken)) {
            log.error("Refresh token not found in Redis. email={}", email);
            throw new CustomException(ErrorStatus.UNAUTHORIZED);
        }

        refreshTokenRepository.delete(email, identifier);

        String newAccess = jwtUtil.createAccessToken(email, userId);
        String newRefresh = jwtUtil.createRefreshToken(email, userId);
        refreshTokenRepository.save(email, jwtUtil.getIdentifier(newRefresh), newRefresh);

        return new JwtDto(newAccess, newRefresh);
    }
}
