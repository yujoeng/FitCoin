package org.a504.fitCoin.domain.auth.repository;

import java.util.Optional;

public interface PasswordResetRepository {

    void save(String token, String email);

    Optional<String> findEmailByToken(String token);

    void delete(String token);
}