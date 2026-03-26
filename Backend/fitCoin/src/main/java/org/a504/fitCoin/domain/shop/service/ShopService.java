package org.a504.fitCoin.domain.shop.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.a504.fitCoin.domain.asset.entity.PointLog;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.asset.repository.PointLogJpaRepository;
import org.a504.fitCoin.domain.asset.value.CoinReason;
import org.a504.fitCoin.domain.asset.value.PointReason;
import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.repository.FurnitureJpaRepository;
import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.a504.fitCoin.domain.shop.dto.response.AcquiredFurnitureInfo;
import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.ItemResponse;
import org.a504.fitCoin.domain.shop.dto.response.AcquiredGifticonInfo;
import org.a504.fitCoin.domain.shop.dto.response.PurchaseCoinFurnitureResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchaseGifticonResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchasePointFurnitureResponse;
import org.a504.fitCoin.domain.shop.value.ShopErrorStatus;
import org.a504.fitCoin.domain.shop.value.ShopItem;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.entity.UserFurniture;
import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.a504.fitCoin.domain.user.repository.UserFurnitureJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.domain.wallet.repository.GifticonJpaRepository;
import org.a504.fitCoin.domain.wallet.repository.WalletJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final UserJpaRepository userJpaRepository;
    private final FurnitureJpaRepository furnitureJpaRepository;
    private final UserFurnitureJpaRepository userFurnitureJpaRepository;
    private final PointLogJpaRepository pointLogJpaRepository;
    private final CoinLogJpaRepository coinLogJpaRepository;
    private final GifticonJpaRepository gifticonJpaRepository;
    private final WalletJpaRepository walletJpaRepository;

    private static final int GIFTICON_WIN_PROBABILITY = 10; // 10%

    public GetItemsResponse getItems() {
        List<ItemResponse> items = Arrays.stream(ShopItem.values())
                .map(ItemResponse::from)
                .toList();
        return new GetItemsResponse(items);
    }

    @Transactional
    public PurchasePointFurnitureResponse purchasePointFurniture(Long userId) {
        User user = userJpaRepository.findByIdWithLock(userId)
                .orElseThrow(() -> new CustomException(UserErrorStatus.USER_NOT_FOUND));

        int price = ShopItem.POINT_FURNITURE_DRAW.getPrice();
        user.deductPoint(price);
        pointLogJpaRepository.save(PointLog.of(user, price, PointReason.FURNITURE_GACHA));

        // 포인트 가구 중 랜덤 선택
        List<Furniture> candidates = furnitureJpaRepository.findAllByType(PurchaseType.POINT);
        if (candidates.isEmpty()) {
            throw new CustomException(ShopErrorStatus.NO_FURNITURE_AVAILABLE);
        }
        Furniture acquired = candidates.get(ThreadLocalRandom.current().nextInt(candidates.size()));

        // 미보유 시 인벤토리에 추가
        boolean isNewAcquired = !userFurnitureJpaRepository.existsByUserAndFurniture(user, acquired);
        if (isNewAcquired) {
            userFurnitureJpaRepository.save(UserFurniture.of(user, acquired));
        }

        // 테마 완성 여부 확인 → 히든 가구 해금
        AcquiredFurnitureInfo hiddenInfo = checkAndUnlockHidden(user, acquired);

        return new PurchasePointFurnitureResponse(
                price,
                user.getPoint(),
                AcquiredFurnitureInfo.of(acquired, isNewAcquired),
                hiddenInfo
        );
    }

    @Transactional
    public PurchaseCoinFurnitureResponse purchaseCoinFurniture(Long userId) {
        User user = userJpaRepository.findByIdWithLock(userId)
                .orElseThrow(() -> new CustomException(UserErrorStatus.USER_NOT_FOUND));

        int price = ShopItem.COIN_FURNITURE_DRAW.getPrice();
        user.deductCoin(price);
        coinLogJpaRepository.save(CoinLog.of(user, price, CoinReason.FURNITURE_GACHA));

        // 코인 가구 중 랜덤 선택
        List<Furniture> candidates = furnitureJpaRepository.findAllByType(PurchaseType.COIN);
        if (candidates.isEmpty()) {
            throw new CustomException(ShopErrorStatus.NO_FURNITURE_AVAILABLE);
        }
        Furniture acquired = candidates.get(ThreadLocalRandom.current().nextInt(candidates.size()));

        // 미보유 시 인벤토리에 추가
        boolean isNewAcquired = !userFurnitureJpaRepository.existsByUserAndFurniture(user, acquired);
        if (isNewAcquired) {
            userFurnitureJpaRepository.save(UserFurniture.of(user, acquired));
        }

        // 테마 완성 여부 확인 → 히든 가구 해금
        AcquiredFurnitureInfo hiddenInfo = checkAndUnlockHidden(user, acquired);

        return new PurchaseCoinFurnitureResponse(
                price,
                user.getCoin(),
                AcquiredFurnitureInfo.of(acquired, isNewAcquired),
                hiddenInfo
        );
    }

    @Transactional
    public PurchaseGifticonResponse purchaseGifticon(Long userId) {
        User user = userJpaRepository.findByIdWithLock(userId)
                .orElseThrow(() -> new CustomException(UserErrorStatus.USER_NOT_FOUND));

        // 뽑기 전 기프티콘 존재 여부 확인
        List<Gifticon> gifticons = gifticonJpaRepository.findAll();
        if (gifticons.isEmpty()) {
            throw new CustomException(ShopErrorStatus.NO_GIFTICON_AVAILABLE);
        }

        int price = ShopItem.COIN_GIFTICON_DRAW.getPrice();
        user.deductCoin(price);
        coinLogJpaRepository.save(CoinLog.of(user, price, CoinReason.GIFTICON_GACHA));

        // 10% 확률 당첨 체크
        boolean isWin = ThreadLocalRandom.current().nextInt(100) < GIFTICON_WIN_PROBABILITY;
        if (!isWin) {
            return new PurchaseGifticonResponse(price, user.getCoin(), null);
        }

        // 랜덤 기프티콘 선택 후 지갑에 추가
        Gifticon gifticon = gifticons.get(ThreadLocalRandom.current().nextInt(gifticons.size()));
        UserGifticon saved = walletJpaRepository.save(
                UserGifticon.builder().user(user).gifticon(gifticon).build()
        );

        return new PurchaseGifticonResponse(
                price,
                user.getCoin(),
                new AcquiredGifticonInfo(saved.getId(), gifticon.getType(), gifticon.getUrl())
        );
    }

    private AcquiredFurnitureInfo checkAndUnlockHidden(User user, Furniture acquired) {
        // 획득한 가구의 테마에서 HIDDEN을 제외한 모든 가구 조회
        List<Furniture> nonHiddenFurnitures = furnitureJpaRepository
                .findAllByThemeAndPositionNot(acquired.getTheme(), FurniturePosition.HIDDEN);

        // 사용자가 보유한 가구 ID 목록
        Set<Long> ownedIds = userFurnitureJpaRepository.findFurnitureIdsByUserId(user.getId());

        // 테마의 모든 non-hidden 가구를 보유하고 있는지 확인
        boolean isThemeComplete = nonHiddenFurnitures.stream()
                .allMatch(f -> ownedIds.contains(f.getId()));
        if (!isThemeComplete) {
            return null;
        }

        // 히든 가구 존재 여부 확인
        return furnitureJpaRepository
                .findByThemeAndPosition(acquired.getTheme(), FurniturePosition.HIDDEN)
                .filter(hidden -> !ownedIds.contains(hidden.getId()))
                .map(hidden -> {
                    userFurnitureJpaRepository.save(UserFurniture.of(user, hidden));
                    return AcquiredFurnitureInfo.of(hidden, true);
                })
                .orElse(null);
    }
}
