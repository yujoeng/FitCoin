package org.a504.fitCoin.domain.shop.service;

import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.ItemResponse;
import org.a504.fitCoin.domain.shop.value.ShopItem;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ShopService {

    public GetItemsResponse getItems() {
        List<ItemResponse> items = Arrays.stream(ShopItem.values())
                .map(ItemResponse::from)
                .toList();
        return new GetItemsResponse(items);
    }
}
