package org.a504.fitCoin.domain.asset.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.dto.AssetResponse;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.global.response.status.ErrorStatus;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AssetService {

    private final UserJpaRepository userJpaRepository;

    public AssetResponse getAsset(Long userId) {

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        return new AssetResponse(user.getPoint(), user.getCoin());
    }
}
