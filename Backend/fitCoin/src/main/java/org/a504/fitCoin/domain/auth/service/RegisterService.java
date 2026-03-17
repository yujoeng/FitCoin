package org.a504.fitCoin.domain.auth.service;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyConfirmRequest;
import org.a504.fitCoin.domain.auth.dto.request.EmailVerifyRequest;
import org.a504.fitCoin.domain.auth.dto.request.RegisterRequest;
import org.a504.fitCoin.domain.auth.dto.response.EmailVerifyConfirmResponse;
import org.a504.fitCoin.domain.auth.repository.EmailVerifyRepository;
import org.a504.fitCoin.domain.room.entity.UserRoom;
import org.a504.fitCoin.domain.room.repository.UserRoomJpaRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.config.property.EmailProperties;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RegisterService {

    private final UserJpaRepository userJpaRepository;
    private final UserRoomJpaRepository userRoomJpaRepository;
    private final EmailVerifyRepository emailVerifyRepository;
    private final TemplateEngine templateEngine;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final EmailProperties emailProperties;

    public void sendVerificationCode(EmailVerifyRequest request) {

        String email = request.email();
        validateUser(email);

        char[] availableChar = new char[]{'2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
        String code = NanoIdUtils.randomNanoId(new SecureRandom(), availableChar, 6);

        emailVerifyRepository.saveVerificationCode(email, code);

        String subject = "[FitCoin] 회원가입 이메일 인증 코드입니다.";

        Context context = new Context();
        context.setVariable("code", code);
        context.setVariable("expiredTime", emailProperties.getCode().getExpiredTime() / (1000 * 60));
        String htmlContent = templateEngine.process("mail-auth", context);
        mailService.sendEmail(email, subject, htmlContent);
    }

    private void validateUser(String email) {
        userJpaRepository.findByEmail(email)
                .ifPresent(u -> {
                    if (u.getDeletedAt() != null) {
                        log.error("This account has been withdrawn. email={}", email);
                        throw new CustomException(ErrorStatus.FORBIDDEN);
                    }
                    log.error("Email already in use. email={}", email);
                    throw new CustomException(ErrorStatus.CONFLICT);
                });
    }

    public EmailVerifyConfirmResponse verifyEmail(EmailVerifyConfirmRequest request) {

        String email = request.email();
        if (!emailVerifyRepository.existsVerificationCode(email, request.code())) {
            log.error("Invalid or expired verification code. email={}", email);
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        emailVerifyRepository.deleteVerificationCode(email);

        String token = NanoIdUtils.randomNanoId();
        emailVerifyRepository.saveVerificationToken(email, token);

        return new EmailVerifyConfirmResponse(token);
    }

    public void register(RegisterRequest request) {
        String email = request.email();

        if (!emailVerifyRepository.existsVerificationToken(email, request.token())) {
            log.error("Invalid or expired verification token. email={}", email);
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        validateUser(email);

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .exerciseLevel(request.exerciseLevel())
                .build();

        userJpaRepository.save(user);
        userRoomJpaRepository.save(UserRoom.of(user));
        emailVerifyRepository.deleteVerificationToken(email);
    }
}
