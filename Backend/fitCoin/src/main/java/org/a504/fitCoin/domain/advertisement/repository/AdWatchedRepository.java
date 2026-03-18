package org.a504.fitCoin.domain.advertisement.repository;

public interface AdWatchedRepository {

    boolean exists(Long userId);

    void save(Long userId);
}
