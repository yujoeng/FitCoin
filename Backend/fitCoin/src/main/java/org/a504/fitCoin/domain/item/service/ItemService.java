package org.a504.fitCoin.domain.item.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.item.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.item.dto.response.ItemResponse;
import org.a504.fitCoin.domain.item.repository.ItemJpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemJpaRepository itemJpaRepository;

    public GetItemsResponse getItems() {
        List<ItemResponse> items = itemJpaRepository.findAll().stream()
                .map(ItemResponse::from)
                .toList();
        return new GetItemsResponse(items);
    }
}
