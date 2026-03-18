package org.a504.fitCoin.domain.auth.repository;

import java.util.Optional;

public interface PasswordChangedRepository {

    void save(String email, long changedAtMs);

    Optional<Long> findChangedAt(String email);
}