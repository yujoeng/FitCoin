package org.a504.fitCoin.domain.asset.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.dto.AssetResponse;
import org.a504.fitCoin.domain.asset.dto.ExchangeRateResponse;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
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
    private final ExchangeJpaRepository exchangeJpaRepository;

    public AssetResponse getAsset(Long userId) {

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorStatus.NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new CustomException(ErrorStatus.BAD_REQUEST);
        }

        return new AssetResponse(user.getPoint(), user.getCoin());
    }

    public ExchangeRateResponse getExchangeRate() {
        return exchangeJpaRepository.findTopByOrderByBaseDateDesc()
                .map(e -> {
                    return new ExchangeRateResponse(e.getBaseDate(), e.getRate());
                })
                .orElseThrow(() -> new CustomException(ErrorStatus.EXCHANGE_RATE_NOT_AVAILABLE));
    }
}
