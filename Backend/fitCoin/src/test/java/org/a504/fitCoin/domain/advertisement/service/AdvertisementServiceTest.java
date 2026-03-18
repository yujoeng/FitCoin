package org.a504.fitCoin.domain.advertisement.service;

import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.entity.Advertisement;
import org.a504.fitCoin.domain.advertisement.repository.AdInProgressRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdWatchedRepository;
import org.a504.fitCoin.domain.advertisement.repository.AdvertisementJpaRepository;
import org.a504.fitCoin.domain.advertisement.value.AdErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

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

    @InjectMocks
    private AdvertisementService advertisementService;

    private static final Long USER_ID = 1L;

    @Test
    void 광고_시청_시작_성공() {
        // given
        Advertisement ad = mock(Advertisement.class);
        given(ad.getUrl()).willReturn("https://example.com/ad");
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of(ad));

        // when
        StartAdResponse response = advertisementService.startAd(USER_ID);

        // then
        assertThat(response.adUrl()).isEqualTo("https://example.com/ad");
        verify(adInProgressRepository).save(eq(USER_ID), any());
    }

    @Test
    void 오늘_이미_시청한_경우_예외_발생() {
        // given
        given(adWatchedRepository.exists(USER_ID)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_ALREADY_WATCHED_TODAY));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void 이미_진행_중인_광고가_있는_경우_예외_발생() {
        // given
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_ALREADY_IN_PROGRESS));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void 등록된_광고가_없는_경우_예외_발생() {
        // given
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of());

        // when & then
        assertThatThrownBy(() -> advertisementService.startAd(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(AdErrorStatus.AD_NOT_FOUND));

        verify(adInProgressRepository, never()).save(any(), any());
    }

    @Test
    void 광고가_여러_개일_때_하나를_반환한다() {
        // given
        Advertisement ad1 = mock(Advertisement.class);
        Advertisement ad2 = mock(Advertisement.class);
        Advertisement ad3 = mock(Advertisement.class);
        // 랜덤 선택으로 일부 stub이 호출되지 않을 수 있으므로 lenient 적용
        lenient().when(ad1.getUrl()).thenReturn("https://example.com/ad1");
        lenient().when(ad2.getUrl()).thenReturn("https://example.com/ad2");
        lenient().when(ad3.getUrl()).thenReturn("https://example.com/ad3");
        given(adWatchedRepository.exists(USER_ID)).willReturn(false);
        given(adInProgressRepository.exists(USER_ID)).willReturn(false);
        given(advertisementJpaRepository.findAll()).willReturn(List.of(ad1, ad2, ad3));

        // when
        StartAdResponse response = advertisementService.startAd(USER_ID);

        // then
        assertThat(response.adUrl()).isIn(
                "https://example.com/ad1",
                "https://example.com/ad2",
                "https://example.com/ad3"
        );
    }
}
