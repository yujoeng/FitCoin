package org.a504.fitCoin.domain.item.service;

import org.a504.fitCoin.domain.item.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.item.dto.response.ItemResponse;
import org.a504.fitCoin.domain.item.value.ShopItem;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ItemService {

    public GetItemsResponse getItems() {
        List<ItemResponse> items = Arrays.stream(ShopItem.values())
                .map(ItemResponse::from)
                .toList();
        return new GetItemsResponse(items);
    }
}
