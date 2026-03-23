package org.a504.fitCoin.domain.shop.service;

import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.shop.dto.response.PurchaseGifticonResponse;
import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.domain.wallet.repository.GifticonJpaRepository;
import org.a504.fitCoin.domain.wallet.repository.WalletJpaRepository;
import org.a504.fitCoin.domain.wallet.value.GifticonType;
import org.mockito.MockedStatic;
import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.entity.Theme;
import org.a504.fitCoin.domain.room.repository.FurnitureJpaRepository;
import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchaseCoinFurnitureResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchasePointFurnitureResponse;
import org.a504.fitCoin.domain.shop.value.ShopErrorStatus;
import org.a504.fitCoin.domain.shop.value.ShopItem;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.repository.UserFurnitureJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock private UserJpaRepository userJpaRepository;
    @Mock private FurnitureJpaRepository furnitureJpaRepository;
    @Mock private UserFurnitureJpaRepository userFurnitureJpaRepository;
    @Mock private PointLogJpaRepository pointLogJpaRepository;
    @Mock private CoinLogJpaRepository coinLogJpaRepository;
    @Mock private GifticonJpaRepository gifticonJpaRepository;
    @Mock private WalletJpaRepository walletJpaRepository;

    @InjectMocks
    private ShopService shopService;

    private static final Long USER_ID = 1L;

    // ===== getItems =====

    @Test
    void getItems_아이템_목록을_반환한다() {
        GetItemsResponse response = shopService.getItems();

        assertThat(response.items()).hasSize(ShopItem.values().length);
    }

    @Test
    void getItems_각_아이템의_정보가_올바르게_반환된다() {
        GetItemsResponse response = shopService.getItems();

        assertThat(response.items().get(0).name()).isEqualTo(ShopItem.COIN_FURNITURE_DRAW.getName());
        assertThat(response.items().get(0).priceType()).isEqualTo(ShopItem.PurchaseType.COIN);
        assertThat(response.items().get(0).price()).isEqualTo(ShopItem.COIN_FURNITURE_DRAW.getPrice());

        assertThat(response.items().get(1).name()).isEqualTo(ShopItem.COIN_GIFTICON_DRAW.getName());
        assertThat(response.items().get(1).priceType()).isEqualTo(ShopItem.PurchaseType.COIN);

        assertThat(response.items().get(2).name()).isEqualTo(ShopItem.POINT_FURNITURE_DRAW.getName());
        assertThat(response.items().get(2).priceType()).isEqualTo(ShopItem.PurchaseType.POINT);
        assertThat(response.items().get(2).price()).isEqualTo(ShopItem.POINT_FURNITURE_DRAW.getPrice());
    }

    // ===== purchasePointFurniture =====

    @Test
    void purchasePointFurniture_성공_신규_가구_획득() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getPoint()).willReturn(700);

        Furniture furniture = buildFurnitureMock(1L);
        Theme theme = furniture.getTheme();
        Furniture otherFurniture = buildFurnitureIdOnlyMock(2L); // 테마 완성 여부 체크에만 사용

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture, otherFurniture));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L)); // otherFurniture 미보유 → 테마 미완성

        PurchasePointFurnitureResponse response = shopService.purchasePointFurniture(USER_ID);

        assertThat(response.spentPoint()).isEqualTo(ShopItem.POINT_FURNITURE_DRAW.getPrice());
        assertThat(response.remainingPoint()).isEqualTo(700);
        assertThat(response.acquiredFurniture().furnitureId()).isEqualTo(1L);
        assertThat(response.acquiredFurniture().isNewAcquired()).isTrue();
        assertThat(response.unlockedHiddenFurniture()).isNull();
        verify(userFurnitureJpaRepository).save(any());
        verify(pointLogJpaRepository).save(any());
    }

    @Test
    void purchasePointFurniture_성공_이미_보유한_가구_재획득() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getPoint()).willReturn(700);

        Furniture furniture = buildFurnitureMock(1L);
        Theme theme = furniture.getTheme();
        Furniture otherFurniture = buildFurnitureIdOnlyMock(2L); // 테마 완성 여부 체크에만 사용

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture)).willReturn(true); // 이미 보유
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture, otherFurniture));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L)); // otherFurniture 미보유 → 테마 미완성

        PurchasePointFurnitureResponse response = shopService.purchasePointFurniture(USER_ID);

        assertThat(response.acquiredFurniture().isNewAcquired()).isFalse();
        assertThat(response.unlockedHiddenFurniture()).isNull();
        verify(userFurnitureJpaRepository, never()).save(any()); // 인벤토리에 추가 없음
    }

    @Test
    void purchasePointFurniture_성공_테마_완성으로_히든_가구_해금() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getPoint()).willReturn(700);

        Furniture furniture1 = buildFurnitureMock(1L);
        Theme theme = furniture1.getTheme();
        Furniture furniture2 = buildFurnitureIdOnlyMock(2L); // 테마 완성 여부 체크에만 사용
        Furniture hiddenFurniture = buildFurnitureMock(10L, theme, FurniturePosition.HIDDEN); // AcquiredFurnitureInfo 생성에 사용

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of(furniture1));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture1)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture1, furniture2));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L, 2L)); // 모든 non-hidden 보유 → 테마 완성
        given(furnitureJpaRepository.findByThemeAndPosition(theme, FurniturePosition.HIDDEN))
                .willReturn(Optional.of(hiddenFurniture));

        PurchasePointFurnitureResponse response = shopService.purchasePointFurniture(USER_ID);

        assertThat(response.acquiredFurniture().isNewAcquired()).isTrue();
        assertThat(response.unlockedHiddenFurniture()).isNotNull();
        assertThat(response.unlockedHiddenFurniture().furnitureId()).isEqualTo(10L);
        assertThat(response.unlockedHiddenFurniture().position()).isEqualTo(FurniturePosition.HIDDEN);
        verify(userFurnitureJpaRepository, times(2)).save(any()); // furniture1 + hiddenFurniture
    }

    @Test
    void purchasePointFurniture_테마_완성이지만_히든_가구가_없는_경우_해금_없음() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getPoint()).willReturn(700);

        Furniture furniture = buildFurnitureMock(1L);
        Theme theme = furniture.getTheme();

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L)); // 테마 완성
        given(furnitureJpaRepository.findByThemeAndPosition(theme, FurniturePosition.HIDDEN))
                .willReturn(Optional.empty()); // 히든 가구 없음

        PurchasePointFurnitureResponse response = shopService.purchasePointFurniture(USER_ID);

        assertThat(response.unlockedHiddenFurniture()).isNull();
    }

    @Test
    void purchasePointFurniture_테마_완성이지만_히든_가구를_이미_보유한_경우_해금_없음() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getPoint()).willReturn(700);

        Furniture furniture = buildFurnitureMock(1L);
        Theme theme = furniture.getTheme();
        Furniture hiddenFurniture = buildFurnitureIdOnlyMock(10L); // getId()만 사용 (filter에서 걸러짐)

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L, 10L)); // 히든 포함 이미 보유
        given(furnitureJpaRepository.findByThemeAndPosition(theme, FurniturePosition.HIDDEN))
                .willReturn(Optional.of(hiddenFurniture));

        PurchasePointFurnitureResponse response = shopService.purchasePointFurniture(USER_ID);

        assertThat(response.unlockedHiddenFurniture()).isNull();
    }

    @Test
    void purchasePointFurniture_포인트_부족한_경우_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_POINT)).given(user).deductPoint(anyInt());

        assertThatThrownBy(() -> shopService.purchasePointFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.INSUFFICIENT_POINT));

        verify(furnitureJpaRepository, never()).findAllByType(any());
    }

    @Test
    void purchasePointFurniture_뽑을_가구가_없는_경우_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.POINT)).willReturn(List.of());

        assertThatThrownBy(() -> shopService.purchasePointFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ShopErrorStatus.NO_FURNITURE_AVAILABLE));

        verify(userFurnitureJpaRepository, never()).save(any());
    }

    @Test
    void purchasePointFurniture_사용자를_찾을_수_없는_경우_예외_발생() {
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.purchasePointFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.USER_NOT_FOUND));
    }

    // ===== purchaseCoinFurniture =====

    @Test
    void purchaseCoinFurniture_성공_신규_가구_획득() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getCoin()).willReturn(990);

        Furniture furniture = buildFurnitureMock(1L);
        Theme theme = furniture.getTheme();
        Furniture otherFurniture = buildFurnitureIdOnlyMock(2L);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.COIN)).willReturn(List.of(furniture));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture, otherFurniture));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L));

        PurchaseCoinFurnitureResponse response = shopService.purchaseCoinFurniture(USER_ID);

        assertThat(response.spentCoin()).isEqualTo(ShopItem.COIN_FURNITURE_DRAW.getPrice());
        assertThat(response.remainingCoin()).isEqualTo(990);
        assertThat(response.acquiredFurniture().furnitureId()).isEqualTo(1L);
        assertThat(response.acquiredFurniture().isNewAcquired()).isTrue();
        assertThat(response.unlockedHiddenFurniture()).isNull();
        verify(userFurnitureJpaRepository).save(any());
        verify(coinLogJpaRepository).save(any());
    }

    @Test
    void purchaseCoinFurniture_성공_테마_완성으로_히든_가구_해금() {
        User user = mock(User.class);
        given(user.getId()).willReturn(USER_ID);
        given(user.getCoin()).willReturn(990);

        Furniture furniture1 = buildFurnitureMock(1L);
        Theme theme = furniture1.getTheme();
        Furniture furniture2 = buildFurnitureIdOnlyMock(2L);
        Furniture hiddenFurniture = buildFurnitureMock(10L, theme, FurniturePosition.HIDDEN);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.COIN)).willReturn(List.of(furniture1));
        given(userFurnitureJpaRepository.existsByUserAndFurniture(user, furniture1)).willReturn(false);
        given(furnitureJpaRepository.findAllByThemeAndPositionNot(theme, FurniturePosition.HIDDEN))
                .willReturn(List.of(furniture1, furniture2));
        given(userFurnitureJpaRepository.findFurnitureIdsByUserId(USER_ID)).willReturn(Set.of(1L, 2L));
        given(furnitureJpaRepository.findByThemeAndPosition(theme, FurniturePosition.HIDDEN))
                .willReturn(Optional.of(hiddenFurniture));

        PurchaseCoinFurnitureResponse response = shopService.purchaseCoinFurniture(USER_ID);

        assertThat(response.unlockedHiddenFurniture()).isNotNull();
        assertThat(response.unlockedHiddenFurniture().furnitureId()).isEqualTo(10L);
        verify(userFurnitureJpaRepository, times(2)).save(any());
    }

    @Test
    void purchaseCoinFurniture_코인_부족한_경우_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_COIN)).given(user).deductCoin(anyInt());

        assertThatThrownBy(() -> shopService.purchaseCoinFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.INSUFFICIENT_COIN));

        verify(furnitureJpaRepository, never()).findAllByType(any());
    }

    @Test
    void purchaseCoinFurniture_뽑을_가구가_없는_경우_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(furnitureJpaRepository.findAllByType(PurchaseType.COIN)).willReturn(List.of());

        assertThatThrownBy(() -> shopService.purchaseCoinFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ShopErrorStatus.NO_FURNITURE_AVAILABLE));
    }

    @Test
    void purchaseCoinFurniture_사용자를_찾을_수_없는_경우_예외_발생() {
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.purchaseCoinFurniture(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.USER_NOT_FOUND));
    }

    // ===== purchaseGifticon =====

    @Test
    void purchaseGifticon_성공_당첨() {
        User user = mock(User.class);
        given(user.getCoin()).willReturn(970);

        Gifticon gifticon = mock(Gifticon.class);
        given(gifticon.getType()).willReturn(GifticonType.COFFEE);
        given(gifticon.getUrl()).willReturn("https://cdn.example.com/gifticon/coffee.png");

        UserGifticon savedGifticon = mock(UserGifticon.class);
        given(savedGifticon.getId()).willReturn(5L);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(gifticonJpaRepository.findAll()).willReturn(List.of(gifticon));
        given(walletJpaRepository.save(any())).willReturn(savedGifticon);

        try (MockedStatic<ThreadLocalRandom> tlr = mockStatic(ThreadLocalRandom.class)) {
            ThreadLocalRandom mockRandom = mock(ThreadLocalRandom.class);
            tlr.when(ThreadLocalRandom::current).thenReturn(mockRandom);
            given(mockRandom.nextInt(100)).willReturn(5);  // < 10 → 당첨
            given(mockRandom.nextInt(1)).willReturn(0);    // 후보 1개 중 첫 번째 선택

            PurchaseGifticonResponse response = shopService.purchaseGifticon(USER_ID);

            assertThat(response.spentCoin()).isEqualTo(ShopItem.COIN_GIFTICON_DRAW.getPrice());
            assertThat(response.remainingCoin()).isEqualTo(970);
            assertThat(response.acquiredGifticon()).isNotNull();
            assertThat(response.acquiredGifticon().gifticonId()).isEqualTo(5L);
            assertThat(response.acquiredGifticon().gifticonType()).isEqualTo(GifticonType.COFFEE);
            verify(walletJpaRepository).save(any());
            verify(coinLogJpaRepository).save(any());
        }
    }

    @Test
    void purchaseGifticon_성공_꽝() {
        User user = mock(User.class);
        given(user.getCoin()).willReturn(970);

        Gifticon gifticon = mock(Gifticon.class);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(gifticonJpaRepository.findAll()).willReturn(List.of(gifticon));

        try (MockedStatic<ThreadLocalRandom> tlr = mockStatic(ThreadLocalRandom.class)) {
            ThreadLocalRandom mockRandom = mock(ThreadLocalRandom.class);
            tlr.when(ThreadLocalRandom::current).thenReturn(mockRandom);
            given(mockRandom.nextInt(100)).willReturn(50); // >= 10 → 꽝

            PurchaseGifticonResponse response = shopService.purchaseGifticon(USER_ID);

            assertThat(response.acquiredGifticon()).isNull();
            verify(walletJpaRepository, never()).save(any());
            verify(coinLogJpaRepository).save(any()); // 꽝이어도 코인 소모
        }
    }

    @Test
    void purchaseGifticon_코인_부족한_경우_예외_발생() {
        User user = mock(User.class);
        Gifticon gifticon = mock(Gifticon.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(gifticonJpaRepository.findAll()).willReturn(List.of(gifticon));
        willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_COIN)).given(user).deductCoin(anyInt());

        assertThatThrownBy(() -> shopService.purchaseGifticon(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.INSUFFICIENT_COIN));

        verify(walletJpaRepository, never()).save(any());
    }

    @Test
    void purchaseGifticon_뽑을_기프티콘이_없는_경우_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(gifticonJpaRepository.findAll()).willReturn(List.of());

        assertThatThrownBy(() -> shopService.purchaseGifticon(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ShopErrorStatus.NO_GIFTICON_AVAILABLE));

        verify(coinLogJpaRepository, never()).save(any()); // 코인 차감 전 예외
    }

    @Test
    void purchaseGifticon_사용자를_찾을_수_없는_경우_예외_발생() {
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.purchaseGifticon(USER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(UserErrorStatus.USER_NOT_FOUND));
    }

    // ===== helpers =====

    /** AcquiredFurnitureInfo 생성에 사용되는 가구 — 모든 필드 스텁 */
    private Furniture buildFurnitureMock(Long id) {
        Theme theme = mock(Theme.class);
        given(theme.getId()).willReturn(99L);
        return buildFurnitureMock(id, theme, FurniturePosition.WINDOW);
    }

    /** AcquiredFurnitureInfo 생성에 사용되는 가구 — 테마 지정 */
    private Furniture buildFurnitureMock(Long id, Theme theme, FurniturePosition position) {
        Furniture furniture = mock(Furniture.class);
        given(furniture.getId()).willReturn(id);
        given(furniture.getTheme()).willReturn(theme);
        given(furniture.getPosition()).willReturn(position);
        given(furniture.getName()).willReturn("테스트 가구 " + id);
        given(furniture.getUrl()).willReturn("https://cdn.example.com/furniture/" + id + ".png");
        return furniture;
    }

    /** 테마 완성 여부 체크에만 쓰이는 가구 — getId()만 스텁 */
    private Furniture buildFurnitureIdOnlyMock(Long id) {
        Furniture furniture = mock(Furniture.class);
        given(furniture.getId()).willReturn(id);
        return furniture;
    }
}