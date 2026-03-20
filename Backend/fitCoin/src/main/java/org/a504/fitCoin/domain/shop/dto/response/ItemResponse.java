package org.a504.fitCoin.domain.shop.dto.response;

import org.a504.fitCoin.domain.shop.value.ShopItem;
import org.a504.fitCoin.domain.shop.value.ShopItem.PurchaseType;

public record ItemResponse(
        String name,
        String description,
        PurchaseType priceType,
        int price
) {
    public static ItemResponse from(ShopItem item) {
        return new ItemResponse(
                item.getName(),
                item.getDescription(),
                item.getPurchaseType(),
                item.getPrice()
        );
    }
}
