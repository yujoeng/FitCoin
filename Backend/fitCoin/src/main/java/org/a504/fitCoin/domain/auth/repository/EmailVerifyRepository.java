package org.a504.fitCoin.domain.auth.repository;

public interface EmailVerifyRepository {

    void saveVerificationCode(String email, String code);

    boolean existsVerificationCode(String email, String code);

    void deleteVerificationCode(String email);

    void saveVerificationToken(String email, String token);

    boolean existsVerificationToken(String email, String token);

    void deleteVerificationToken(String email);
}
