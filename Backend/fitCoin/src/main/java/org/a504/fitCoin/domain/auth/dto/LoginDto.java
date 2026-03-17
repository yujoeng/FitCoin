package org.a504.fitCoin.domain.auth.dto;

public record LoginDto(

        String accessToken,
        String refreshToken
) {
}
