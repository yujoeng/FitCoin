package org.a504.fitCoin.domain.auth.dto;

public record JwtDto(

        String accessToken,
        String refreshToken
) {
}
