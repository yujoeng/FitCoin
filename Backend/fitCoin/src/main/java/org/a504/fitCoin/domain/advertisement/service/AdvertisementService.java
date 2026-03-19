package org.a504.fitCoin.domain.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.advertisement.dto.response.AdAvailabilityResponse;
import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.entity.Advertisement;
import org.a504.fitCoin.domain.advertisement.repository.AdInProgressRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdWatchedRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdvertisementJpaRepository;
import org.a504.fitCoin.domain.advertisement.value.AdErrorStatus;
import org.a504.fitCoin.domain.asset.entity.PointLog;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.asset.value.TransactionType;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AdvertisementService {

    private static final int AD_REWARD_POINTS = 500;
    private static final long MIN_WATCH_SECONDS = 10L;

    private final AdWatchedRepository adWatchedRepository;
    private final AdInProgressRepository adInProgressRepository;
    private final AdvertisementJpaRepository advertisementJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final PointLogJpaRepository pointLogJpaRepository;

    public AdAvailabilityResponse getAvailability(Long userId) {
        boolean available = !adWatchedRepository.exists(userId);
        return new AdAvailabilityResponse(available);
    }

    public StartAdResponse startAd(Long userId) {
        if (adWatchedRepository.exists(userId)) {
            throw new CustomException(AdErrorStatus.AD_ALREADY_WATCHED_TODAY);
        }
        if (adInProgressRepository.exists(userId)) {
            throw new CustomException(AdErrorStatus.AD_ALREADY_IN_PROGRESS);
        }

        List<Advertisement> ads = advertisementJpaRepository.findAll();
        if (ads.isEmpty()) {
            throw new CustomException(AdErrorStatus.AD_NOT_FOUND);
        }

        Advertisement ad = ads.get(ThreadLocalRandom.current().nextInt(ads.size()));
        adInProgressRepository.save(userId, Instant.now());

        return new StartAdResponse(ad.getUrl());
    }

    @Transactional
    public void completeAd(Long userId) {
        Instant startedAt = adInProgressRepository.getAndDelete(userId)
                .orElseThrow(() -> new CustomException(AdErrorStatus.AD_NOT_IN_PROGRESS));

        long elapsedSeconds = Duration.between(startedAt, Instant.now()).getSeconds();
        if (elapsedSeconds < MIN_WATCH_SECONDS) {
            throw new CustomException(AdErrorStatus.AD_ABUSE_DETECTED);
        }

        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserErrorStatus.USER_NOT_FOUND));
        user.addPoint(AD_REWARD_POINTS);
        pointLogJpaRepository.save(PointLog.of(user, AD_REWARD_POINTS, TransactionType.EARN));

        adWatchedRepository.save(userId);
    }
}
