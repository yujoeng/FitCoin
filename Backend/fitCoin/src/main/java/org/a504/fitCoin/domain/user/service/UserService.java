package org.a504.fitCoin.domain.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.auth.repository.AccessTokenRepository;
import org.a504.fitCoin.domain.auth.repository.RefreshTokenRepository;
import org.a504.fitCoin.domain.user.dto.response.MyPageResponse;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository userJpaRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AccessTokenRepository accessTokenRepository;

    public MyPageResponse getMyInfo(Long userId) {

        return userJpaRepository.findById(userId)
                .map(u -> {
                    if (u.getDeletedAt() != null)
                        throw new CustomException(ErrorStatus.BAD_REQUEST);
                    return new MyPageResponse(u.getEmail(), u.getNickname(), u.getExerciseLevel());
                })
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));
    }

    public void deleteUser(Long userId) {

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        user.delete();

        String email = user.getEmail();
        long deletedAtMs = System.currentTimeMillis();
        refreshTokenRepository.deleteAll(email);
        accessTokenRepository.saveInvalidationTime(email, deletedAtMs);
    }
}
