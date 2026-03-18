package org.a504.fitCoin.domain.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.user.dto.response.MyPageResponse;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository userJpaRepository;

    public MyPageResponse getMyInfo(Long userId) {

        return userJpaRepository.findById(userId)
                .map(u -> {
                    if (u.getDeletedAt() != null)
                        throw new CustomException(ErrorStatus.BAD_REQUEST);
                    return new MyPageResponse(u.getEmail(), u.getNickname(), u.getExerciseLevel());
                })
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));
    }
}
