package org.a504.fitCoin.domain.shop.controller;

import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.ItemResponse;
import org.a504.fitCoin.domain.shop.service.ShopService;
import org.a504.fitCoin.domain.shop.value.ShopItem.PurchaseType;
import org.a504.fitCoin.global.config.property.CorsConfigProperties;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShopController.class)
@ActiveProfiles("test")
class ShopControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ShopService shopService;

    @MockitoBean
    private CorsConfigProperties corsConfigProperties;

    @Test
    @WithMockUser
    void 상점_아이템_목록_조회_성공() throws Exception {
        GetItemsResponse response = new GetItemsResponse(List.of(
                new ItemResponse("코인 가구 랜덤 뽑기권", "설명1", PurchaseType.COIN, 10),
                new ItemResponse("코인 기프티콘 뽑기권", "설명2", PurchaseType.COIN, 30),
                new ItemResponse("포인트 가구 랜덤 뽑기권", "설명3", PurchaseType.POINT, 300)
        ));
        given(shopService.getItems()).willReturn(response);

        mockMvc.perform(get("/shop/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.items").isArray())
                .andExpect(jsonPath("$.result.items.length()").value(3))
                .andExpect(jsonPath("$.result.items[0].name").value("코인 가구 랜덤 뽑기권"))
                .andExpect(jsonPath("$.result.items[0].priceType").value("COIN"))
                .andExpect(jsonPath("$.result.items[0].price").value(10))
                .andExpect(jsonPath("$.result.items[1].name").value("코인 기프티콘 뽑기권"))
                .andExpect(jsonPath("$.result.items[2].priceType").value("POINT"));
    }

    @Test
    void 상점_아이템_목록_조회_인증_없이_요청하면_401_반환() throws Exception {
        mockMvc.perform(get("/shop/items"))
                .andExpect(status().isUnauthorized());
    }
}
