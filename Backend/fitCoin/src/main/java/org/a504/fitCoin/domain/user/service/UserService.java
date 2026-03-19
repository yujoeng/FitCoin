package org.a504.fitCoin.domain.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.repository.AccessTokenRepository;
import org.a504.fitCoin.domain.auth.repository.RefreshTokenRepository;
import org.a504.fitCoin.domain.user.dto.request.NewPasswordRequest;
import org.a504.fitCoin.domain.user.dto.response.MyPageResponse;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository userJpaRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public MyPageResponse getMyInfo(Long userId) {

        User user = findUser(userId);
        return new MyPageResponse(user.getEmail(), user.getNickname(), user.getExerciseLevel());
    }

    public void deleteUser(Long userId) {

        User user = findUser(userId);

        user.delete();

        String email = user.getEmail();
        long deletedAtMs = System.currentTimeMillis();
        refreshTokenRepository.deleteAll(email);
        accessTokenRepository.saveInvalidationTime(email, deletedAtMs);
    }

    public void changeNickname(Long userId, String nickname) {

        User user = findUser(userId);
        user.updateNickname(nickname);
    }

    public void changeExerciseLevel(Long userId, ExerciseLevel exerciseLevel) {

        User user = findUser(userId);
        user.updateExerciseLevel(exerciseLevel);
    }

    public void changePassword(Long userId, NewPasswordRequest request) {

        String password = request.password();
        String newPassword = request.newPassword();

        User user = findUser(userId);

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new CustomException(ErrorStatus.BAD_REQUEST);

        user.updatePassword(passwordEncoder.encode(newPassword));

        long changedAtMs = System.currentTimeMillis();
        refreshTokenRepository.deleteAll(user.getEmail());
        accessTokenRepository.saveInvalidationTime(user.getEmail(), changedAtMs);
    }


    public User findUser(Long userId) {
        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        return user;
    }
}
