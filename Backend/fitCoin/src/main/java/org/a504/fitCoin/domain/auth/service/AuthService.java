package org.a504.fitCoin.domain.auth.service;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyRequest;
import org.a504.fitCoin.domain.auth.repository.EmailVerifyRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserJpaRepository userJpaRepository;
    private final EmailVerifyRepository emailVerifyRepository;
    private final TemplateEngine templateEngine;
    private final MailService mailService;

    @Value("${email.expired-time}")
    private Long emailExpiredTime;

    public void sendVerificationCode(EmailVerifyRequest request) {

        String email = request.email();
        validateUser(email);

        char[] availableChar = new char[]{'2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
        String code = NanoIdUtils.randomNanoId(new SecureRandom(), availableChar, 6);

        emailVerifyRepository.saveVerificationCode(email, code);

        String subject = "[FitCoin] 회원가입 이메일 인증 코드입니다.";

        Context context = new Context();
        context.setVariable("code", code);
        context.setVariable("expiredTime", emailExpiredTime);
        String htmlContent = templateEngine.process("mail-auth", context);
        mailService.sendEmail(email, subject, htmlContent);
    }

    private Optional<User> validateUser(String email) {
        return userJpaRepository.findByEmail(email)
                .map(u -> {
                    LocalDateTime deletedAt = u.getDeletedAt();
                    if (deletedAt != null && deletedAt.isBefore(LocalDateTime.now())) {
                        log.error("This account has been withdrawn.");
                        throw new CustomException(ErrorStatus.CONFLICT);
                    }
                    return u;
                });
    }
}
