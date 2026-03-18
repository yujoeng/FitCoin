package org.a504.fitCoin.domain.advertisement.repository;

import java.time.Instant;
import java.util.Optional;

public interface AdInProgressRepository {

    boolean exists(Long userId);

    void save(Long userId, Instant startedAt);

    Optional<Instant> getAndDelete(Long userId);
}
