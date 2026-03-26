package org.a504.fitCoin.domain.asset.service;

import org.a504.fitCoin.domain.asset.entity.Exchange;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeJpaRepository;
import org.a504.fitCoin.domain.asset.repository.ExchangeRateHistoryRepository;
import org.a504.fitCoin.domain.asset.value.TransactionType;
import org.a504.fitCoin.global.config.property.ExchangeProperties;
import org.a504.fitCoin.global.util.MailClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.argThat;

@ExtendWith(MockitoExtension.class)
class ExchangeRateServiceTest {

    private static final String ADMIN_EMAIL = "admin@fitcoin.test";
    @Mock
    private ExchangeProperties properties;
    @Mock
    private ExchangeJpaRepository exchangeJpaRepository;
    @Mock
    private CoinLogJpaRepository coinLogJpaRepository;
    @Mock
    private ExchangeRateHistoryRepository exchangeRateHistoryRepository;
    @Mock
    private MailClient mailClient;
    @InjectMocks
    private ExchangeRateService exchangeRateService;

    // 기본 프로퍼티 세팅 (테스트 단위로 override 가능)
    @BeforeEach
    void setUp() {
        TransactionSynchronizationManager.initSynchronization();
        ReflectionTestUtils.setField(exchangeRateService, "adminEmail", ADMIN_EMAIL);

        lenient().when(properties.getInitialEwma()).thenReturn(100.0);
        lenient().when(properties.getLambda()).thenReturn(0.1);
        lenient().when(properties.getK()).thenReturn(0.5);
        lenient().when(properties.getUpperPct()).thenReturn(0.05);
        lenient().when(properties.getLowerPct()).thenReturn(0.05);
        lenient().when(properties.getAbsFloor()).thenReturn(100);
        lenient().when(properties.getSmoothMin()).thenReturn(1);
    }

    @AfterEach
    void tearDown() {
        TransactionSynchronizationManager.clearSynchronization();
    }

    // ===== calculate =====

    @Test
    void calculate_어제EWMA없을때_initialEwma를_사용한다() {
        // given
        given(exchangeJpaRepository.findByBaseDate(any())).willReturn(Optional.empty());
        given(coinLogJpaRepository.sumAddedCoinsByDate(any(), eq(TransactionType.EARN))).willReturn(100L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.empty());
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: save가 1회 호출되고 저장된 Exchange에 baseDate가 오늘인지 확인
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getBaseDate()).isEqualTo(LocalDate.now());
    }

    @Test
    void calculate_최근환율없을때_absFloor를_초기환율로_사용한다() {
        // given: 이전 환율 없음 → absFloor(100) 사용
        given(exchangeJpaRepository.findByBaseDate(any())).willReturn(Optional.empty());
        given(coinLogJpaRepository.sumAddedCoinsByDate(any(), eq(TransactionType.EARN))).willReturn(100L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.empty());
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: absFloor(100)을 prevRate로 사용했으므로 rate는 absFloor 이상
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isGreaterThanOrEqualTo(100);
    }

    @Test
    void calculate_수요_같을때_환율_유지() {
        // given: todayCoins == smooth(≈prevEwma) → demand = 1 → rawRate = prevRate
        // prevEwma=100, smooth=100, todayCoins=100, demand = log1p(100)/log1p(100) = 1.0
        // raw = 200*(1+0.5*(1-1)) = 200, upper=210, lower=max(190,100)=190 → result=200
        Exchange yesterday = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();

        given(exchangeJpaRepository.findByBaseDate(LocalDate.now().minusDays(1))).willReturn(Optional.of(yesterday));
        given(coinLogJpaRepository.sumAddedCoinsByDate(LocalDate.now(), TransactionType.EARN)).willReturn(100L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: demand=1 → 환율 변화 없음 → rate = 200
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isEqualTo(200);
    }

    @Test
    void calculate_수요_높을때_상한선으로_클리핑된다() {
        // given: todayCoins 매우 많음 → demand >> 1 → rawRate > upper → 상한 클리핑
        // prevRate=200, upper=200*1.05=210
        Exchange yesterday = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();

        given(exchangeJpaRepository.findByBaseDate(LocalDate.now().minusDays(1))).willReturn(Optional.of(yesterday));
        given(coinLogJpaRepository.sumAddedCoinsByDate(LocalDate.now(), TransactionType.EARN)).willReturn(100_000L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: rate = round(200 * 1.05) = 210
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isEqualTo(210);
    }

    @Test
    void calculate_수요_없을때_하한선으로_클리핑된다() {
        // given: todayCoins=0 → demand=0 → rawRate = prevRate*(1-k) = 200*0.5 = 100
        // lower = max(200*0.95, 100) = max(190, 100) = 190 → result=190
        Exchange yesterday = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();

        given(exchangeJpaRepository.findByBaseDate(LocalDate.now().minusDays(1))).willReturn(Optional.of(yesterday));
        given(coinLogJpaRepository.sumAddedCoinsByDate(LocalDate.now(), TransactionType.EARN)).willReturn(0L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: rate = 190 (lowerPct 클리핑)
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isEqualTo(190);
    }

    @Test
    void calculate_absFloor_미만으로_내려가지_않는다() {
        // given: prevRate=105, lowerPct=0.05 → lower=max(105*0.95,100)=max(99.75,100)=100
        // todayCoins=0 → raw=105*(1-0.5)=52.5 → clipped to 100
        Exchange yesterday = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(105)
                .ewma(100.0)
                .build();
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(105)
                .ewma(100.0)
                .build();

        given(exchangeJpaRepository.findByBaseDate(LocalDate.now().minusDays(1))).willReturn(Optional.of(yesterday));
        given(coinLogJpaRepository.sumAddedCoinsByDate(LocalDate.now(), TransactionType.EARN)).willReturn(0L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: absFloor(100) 미만 불가
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isGreaterThanOrEqualTo(100);
    }

    @Test
    void calculate_EWMA가_올바르게_업데이트된다() {
        // given: prevEwma=100.0, lambda=0.1, todayCoins=200
        // newEwma = 200*0.1 + 100.0*0.9 = 20 + 90 = 110.0
        Exchange yesterday = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(200)
                .ewma(100.0)
                .build();

        given(exchangeJpaRepository.findByBaseDate(LocalDate.now().minusDays(1))).willReturn(Optional.of(yesterday));
        given(coinLogJpaRepository.sumAddedCoinsByDate(LocalDate.now(), TransactionType.EARN)).willReturn(200L);
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.calculate();

        // then: ewma = 110.0
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getEwma()).isEqualTo(110.0);
    }

    // ===== recover =====

    @Test
    void recover_최근환율있을때_전날환율로_저장한다() {
        // given
        Exchange latest = Exchange.builder()
                .baseDate(LocalDate.now().minusDays(1))
                .rate(350)
                .ewma(100.0)
                .build();
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.of(latest));
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.recover(new RuntimeException("테스트 오류"));

        // then
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        Exchange saved = captor.getValue();
        assertThat(saved.getBaseDate()).isEqualTo(LocalDate.now());
        assertThat(saved.getRate()).isEqualTo(350);
        assertThat(saved.getEwma()).isEqualTo(100.0); // initialEwma
    }

    @Test
    void recover_최근환율없을때_absFloor로_저장한다() {
        // given
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.empty());
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.recover(new RuntimeException("테스트 오류"));

        // then
        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeJpaRepository).save(captor.capture());
        assertThat(captor.getValue().getRate()).isEqualTo(100); // absFloor
    }

    @Test
    void recover_실패_알림_메일을_전송한다() {
        // given
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.empty());
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.recover(new RuntimeException("테스트 오류"));

        // then
        verify(mailClient).sendTemplateEmail(
                eq(ADMIN_EMAIL),
                eq("[FitCoin] 환율 계산 실패 알림"),
                eq("mail-exchange-rate-failure"),
                any()
        );
    }

    @Test
    void recover_메일에_날짜와_오류메시지가_포함된다() {
        // given
        given(exchangeJpaRepository.findTopByOrderByBaseDateDesc()).willReturn(Optional.empty());
        given(exchangeJpaRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        exchangeRateService.recover(new RuntimeException("DB 연결 실패"));

        // then: variables map에 date, fallbackRate, errorMessage 포함 여부는 mailClient 호출로 검증
        verify(mailClient).sendTemplateEmail(
                anyString(),
                anyString(),
                anyString(),
                argThat(map ->
                        map.containsKey("date") &&
                                map.containsKey("fallbackRate") &&
                                map.containsKey("errorMessage") &&
                                "DB 연결 실패".equals(map.get("errorMessage"))
                )
        );
    }
}
