package org.a504.fitCoin.domain.shop.service;

import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.value.ShopItem;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ShopServiceTest {

    private final ShopService shopService = new ShopService();

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
}
