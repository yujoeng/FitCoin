package org.a504.fitCoin.domain.item.service;

import org.a504.fitCoin.domain.item.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.item.entity.Item;
import org.a504.fitCoin.domain.item.entity.Item.PurchaseType;
import org.a504.fitCoin.domain.item.repository.ItemJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemJpaRepository itemJpaRepository;

    @InjectMocks
    private ItemService itemService;

    @Test
    void getItems_아이템_목록을_반환한다() {
        // given
        Item item1 = mockItem("포인트 가구 랜덤 뽑기권", "설명1", PurchaseType.POINT, 300);
        Item item2 = mockItem("코인 가구 랜덤 뽑기권", "설명2", PurchaseType.COIN, 10);
        Item item3 = mockItem("기프티콘 뽑기권", "설명3", PurchaseType.COIN, 30);
        given(itemJpaRepository.findAll()).willReturn(List.of(item1, item2, item3));

        // when
        GetItemsResponse response = itemService.getItems();

        // then
        assertThat(response.items()).hasSize(3);
        assertThat(response.items().get(0).name()).isEqualTo("포인트 가구 랜덤 뽑기권");
        assertThat(response.items().get(0).priceType()).isEqualTo(PurchaseType.POINT);
        assertThat(response.items().get(0).price()).isEqualTo(300);
        assertThat(response.items().get(1).name()).isEqualTo("코인 가구 랜덤 뽑기권");
        assertThat(response.items().get(2).priceType()).isEqualTo(PurchaseType.COIN);
    }

    @Test
    void getItems_DB에_아이템이_없으면_빈_목록을_반환한다() {
        // given
        given(itemJpaRepository.findAll()).willReturn(List.of());

        // when
        GetItemsResponse response = itemService.getItems();

        // then
        assertThat(response.items()).isEmpty();
    }

    private Item mockItem(String name, String description, PurchaseType priceType, int price) {
        Item item = mock(Item.class);
        when(item.getName()).thenReturn(name);
        when(item.getDescription()).thenReturn(description);
        when(item.getType()).thenReturn(priceType);
        when(item.getPrice()).thenReturn(price);
        return item;
    }
}
