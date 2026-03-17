package org.a504.fitCoin.domain.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.repository.AccessTokenBlacklistRepository;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
import org.a504.fitCoin.domain.auth.util.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AccessTokenBlacklistRepository accessTokenBlacklistRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = authorization.split(" ")[1];

        if (accessTokenBlacklistRepository.exists(accessToken)) {
            log.error("Blacklisted access token.");
            ResponseUtil.setResponse(response, HttpStatus.UNAUTHORIZED, false, "GLOBAL-401", "Invalid access token.");
            return;
        }

        Claims claims;
        try {
            claims = jwtUtil.extractAllClaims(accessToken);
        } catch (ExpiredJwtException e) {
            if (!"access".equals(e.getClaims().get("category", String.class))) {
                log.error("Expired token is not an access token.");
                ResponseUtil.setResponse(response, HttpStatus.UNAUTHORIZED, false, "GLOBAL-401", "Invalid access token.");
                return;
            }
            log.error("Access token expired.");
            ResponseUtil.setResponse(response, HttpStatus.UNAUTHORIZED, false, "REISSUE-401", "토큰 재발급 필요");
            return;
        } catch (JwtException e) {
            log.error("Invalid access token.");
            ResponseUtil.setResponse(response, HttpStatus.UNAUTHORIZED, false, "GLOBAL-401", "Invalid access token.");
            return;
        }

        if (!"access".equals(claims.get("category", String.class))) {
            log.error("Not an access token.");
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Not an access token.");
            return;
        }

        String email = claims.get("email", String.class);
        Long userId = claims.get("userId", Long.class);

        CustomUserDetails customUserDetails = CustomUserDetails.forJwt(email, userId);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        return path.startsWith("/api/auth/") ||
                path.startsWith("/api/swagger-ui") ||
                path.startsWith("/api/v3/api-docs") ||
                path.equals("/api/swagger-ui.html") ||
                path.equals("/error") ||
                path.equals("/favicon.ico") ||
                path.equals("/health");
    }
}