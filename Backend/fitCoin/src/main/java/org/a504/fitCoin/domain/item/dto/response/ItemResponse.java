package org.a504.fitCoin.domain.item.dto.response;

import org.a504.fitCoin.domain.item.entity.Item;
import org.a504.fitCoin.domain.item.entity.Item.PurchaseType;

public record ItemResponse(
        String name,
        String description,
        PurchaseType priceType,
        int price
) {
    public static ItemResponse from(Item item) {
        return new ItemResponse(
                item.getName(),
                item.getDescription(),
                item.getType(),
                item.getPrice()
        );
    }
}
