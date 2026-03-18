package org.a504.fitCoin.domain.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.entity.Advertisement;
import org.a504.fitCoin.domain.advertisement.repository.AdInProgressRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdWatchedRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdvertisementJpaRepository;
import org.a504.fitCoin.domain.advertisement.value.AdErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AdvertisementService {

    private final AdWatchedRepository adWatchedRepository;
    private final AdInProgressRepository adInProgressRepository;
    private final AdvertisementJpaRepository advertisementJpaRepository;

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
}
