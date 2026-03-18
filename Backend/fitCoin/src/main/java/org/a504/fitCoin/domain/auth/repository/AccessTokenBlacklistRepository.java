package org.a504.fitCoin.domain.auth.repository;

public interface AccessTokenBlacklistRepository {

    void save(String accessToken, long expiredInMs);

    boolean exists(String accessToken);
}