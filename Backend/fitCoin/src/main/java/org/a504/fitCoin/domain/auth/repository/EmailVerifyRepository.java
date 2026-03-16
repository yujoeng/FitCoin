package org.a504.fitCoin.domain.auth.repository;

public interface EmailVerifyRepository {

    void saveVerificationCode(String email, String code);
}
