package org.a504.fitCoin.domain.item.value;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ShopItem {

    COIN_FURNITURE_DRAW("코인 가구 랜덤 뽑기권", "코인으로 가구를 랜덤으로 뽑습니다.", 10, PurchaseType.COIN, Category.FURNITURE_DRAW),
    COIN_GIFTICON_DRAW("코인 기프티콘 뽑기권", "코인으로 기프티콘을 뽑습니다. 10% 확률로 당첨됩니다.", 30, PurchaseType.COIN, Category.GIFTICON_DRAW),
    POINT_FURNITURE_DRAW("포인트 가구 랜덤 뽑기권", "포인트로 가구를 랜덤으로 뽑습니다.", 300, PurchaseType.POINT, Category.FURNITURE_DRAW);

    private final String name;
    private final String description;
    private final int price;
    private final PurchaseType purchaseType;
    private final Category category;

    public enum PurchaseType {
        COIN, POINT
    }

    public enum Category {
        FURNITURE_DRAW, GIFTICON_DRAW
    }
}
