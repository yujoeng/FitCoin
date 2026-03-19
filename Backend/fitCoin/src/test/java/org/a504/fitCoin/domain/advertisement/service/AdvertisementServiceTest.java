package org.a504.fitCoin.domain.advertisement.service;

import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.entity.Advertisement;
import org.a504.fitCoin.domain.advertisement.repository.AdInProgressRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdWatchedRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdvertisementJpaRepository;
import org.a504.fitCoin.domain.advertisement.value.AdErrorStatus;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdvertisementServiceTest {

    @Mock private AdWatchedRepository adWatchedRepository;
    @Mock private AdInProgressRepository adInProgressRepository;
    @Mock private AdvertisementJpaRepository advertisementJpaRepository;
    @Mock private UserJpaRepository userJpaRepository;
    @Mock private PointLogJpaRepository pointLogJpaRepository;

    @InjectMocks
    private AdvertisementService advertisementService;

    private static final Long USER_ID = 1L;

    // ===== startAd =====

    @Test
    void startAd_성공() {
        Advertisement ad = mock(Advertisement.class);
        given(ad.getUrl()).willReturn("https://example.com/ad");
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of(ad));

        StartAdResponse response = advertisementService.startAd(USER_ID);

        assertThat(response.adUrl()).isEqualTo("https://example.com/ad");
        verify(adInProgressRepository).save(eq(USER_ID), any());
    }

    @Test
    void startAd_오늘_이미_시청한_경우_예외_발생() {
        given(adWatchedRepository.exists(USER_ID)).willReturn(true);

        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_ALREADY_WATCHED_TODAY));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void startAd_이미_진행_중인_광고가_있는_경우_예외_발생() {
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(true);

        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_ALREADY_IN_PROGRESS));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void startAd_등록된_광고가_없는_경우_예외_발생() {
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of());

        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_NOT_FOUND));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void startAd_광고가_여러_개일_때_하나를_반환한다() {
        Advertisement ad1 = mock(Advertisement.class);
        Advertisement ad2 = mock(Advertisement.class);
        Advertisement ad3 = mock(Advertisement.class);
        lenient().when(ad1.getUrl()).thenReturn("https://example.com/ad1");
        lenient().when(ad2.getUrl()).thenReturn("https://example.com/ad2");
        lenient().when(ad3.getUrl()).thenReturn("https://example.com/ad3");
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of(ad1, ad2, ad3));

        StartAdResponse response = advertisementService.startAd(USER_ID);

        assertThat(response.adUrl()).isIn(
                "https://example.com/ad1",
                "https://example.com/ad2",
                "https://example.com/ad3"
        );
    }

    // ===== completeAd =====

    @Test
    void completeAd_성공() {
        // given
        User user = mock(User.class);
        given(adInProgressRepository.getAndDelete(USER_ID))
                .willReturn(Optional.of(Instant.now().minusSeconds(15)));
        given(userJpaRepository.findById(USER_ID)).willReturn(Optional.of(user));

        // when
        advertisementService.completeAd(USER_ID);

        // then
        verify(user).addPoint(500);
        verify(pointLogJpaRepository).save(any());
        verify(adWatchedRepository).save(USER_ID);
    }

    @Test
    void completeAd_진행_중인_광고가_없는_경우_예외_발생() {
        given(adInProgressRepository.getAndDelete(USER_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> advertisementService.completeAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_NOT_IN_PROGRESS));

        verify(userJpaRepository, never()).findById(any());
        verify(adWatchedRepository, never()).save(any());
    }

    @Test
    void completeAd_시청_시간이_너무_짧으면_어뷰징으로_판단() {
        // given: 방금 시작한 것처럼 현재 시각으로 저장 (0초 경과)
        given(adInProgressRepository.getAndDelete(USER_ID))
                .willReturn(Optional.of(Instant.now()));

        assertThatThrownBy(() -> advertisementService.completeAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_ABUSE_DETECTED));

        verify(userJpaRepository, never()).findById(any());
        verify(adWatchedRepository, never()).save(any());
    }

    @Test
    void completeAd_사용자를_찾을_수_없는_경우_예외_발생() {
        given(adInProgressRepository.getAndDelete(USER_ID))
                .willReturn(Optional.of(Instant.now().minusSeconds(15)));
        given(userJpaRepository.findById(USER_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> advertisementService.completeAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.USER_NOT_FOUND));

        verify(adWatchedRepository, never()).save(any());
    }
}
