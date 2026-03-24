package org.a504.fitCoin.domain.auth.service;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.dto.JwtDto;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyRequest;
import org.a504.fitCoin.domain.auth.dto.request.LoginRequest;
import org.a504.fitCoin.domain.auth.dto.request.ResetPasswordRequest;
import org.a504.fitCoin.domain.auth.jwt.JwtUtil;
import org.a504.fitCoin.domain.auth.repository.AccessTokenRepository;
import org.a504.fitCoin.domain.auth.repository.PasswordResetRepository;
import org.a504.fitCoin.domain.auth.repository.RefreshTokenRepository;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.a504.fitCoin.global.util.MailClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final UserJpaRepository userJpaRepository;
    private final MailClient mailClient;
    private final TemplateEngine templateEngine;
    private final PasswordEncoder passwordEncoder;

    @Value("${password-reset.url}")
    private String passwordResetUrl;

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

    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            try {
                Claims claims = jwtUtil.extractAllClaims(accessToken);
                long remainingMs = claims.getExpiration().getTime() - System.currentTimeMillis();
                if (remainingMs > 0) {
                    accessTokenRepository.blacklist(accessToken, remainingMs);
                }
            } catch (Exception e) {
                log.warn("Failed to blacklist access token during logout: {}", e.getMessage());
            }
        }

        if (refreshToken != null) {
            try {
                Claims claims = jwtUtil.extractAllClaims(refreshToken);
                String email = claims.get("email", String.class);
                String identifier = claims.get("identifier", String.class);
                refreshTokenRepository.delete(email, identifier);
            } catch (Exception e) {
                log.warn("Failed to delete refresh token during logout: {}", e.getMessage());
            }
        }
    }

    public void sendPasswordResetUrl(EmailVerifyRequest request) {
        String email = request.email();
        boolean exists = userJpaRepository.findByEmail(email)
                .map(user -> user.getDeletedAt() == null)
                .orElse(false);

        if (!exists) return;

        String token = NanoIdUtils.randomNanoId();
        passwordResetRepository.save(token, email);

        String resetLink = passwordResetUrl + "?token=" + token;
        String subject = "[FitCoin] 비밀번호 재설정 안내";

        Context context = new Context();
        context.setVariable("resetUrl", resetLink);
        String htmlContent = templateEngine.process("mail-password-reset", context);
        mailClient.sendEmail(email, subject, htmlContent);
    }

    public void resetPassword(ResetPasswordRequest request) {
        String email = passwordResetRepository.findEmailByToken(request.token())
                .orElseThrow(() -> {
                    log.warn("Password reset token not found or expired. token={}", request.token());
                    return new CustomException(ErrorStatus.BAD_REQUEST);
                });

        userJpaRepository.findByEmail(email)
                .ifPresent(user -> user.updatePassword(passwordEncoder.encode(request.password())));

        long changedAtMs = System.currentTimeMillis();
        refreshTokenRepository.deleteAll(email);
        accessTokenRepository.saveInvalidationTime(email, changedAtMs);
        passwordResetRepository.delete(request.token());
    }
}
