package org.a504.fitCoin.domain.auth.repository;

public interface RefreshTokenRepository {

    void save(String email, String identifier, String refreshToken);

    boolean exists(String email, String identifier, String refreshToken);

    void delete(String email, String identifier);
}
