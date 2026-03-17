package org.a504.fitCoin.domain.auth.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.dto.LoginDto;
import org.a504.fitCoin.domain.auth.dto.request.LoginRequest;
import org.a504.fitCoin.domain.auth.jwt.JwtUtil;
import org.a504.fitCoin.domain.auth.repository.RefreshTokenRepository;
import org.a504.fitCoin.domain.auth.security.CustomUserDetails;
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

    public LoginDto login(LoginRequest request) {

        String username = request.email();
        String password = request.password();

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(username, password);

        Authentication authentication = authenticationManager.authenticate(authToken);

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getUsername();

        String access = jwtUtil.createAccessToken(email);
        String refresh = jwtUtil.createRefreshToken(email);
        refreshTokenRepository.save(email, jwtUtil.getIdentifier(refresh), refresh);

        return new LoginDto(access, refresh);
    }
}
