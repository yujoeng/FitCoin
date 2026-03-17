package org.a504.fitCoin.domain.auth.dto.request;

public record LoginRequest(
        String email,
        String password
) {
}
