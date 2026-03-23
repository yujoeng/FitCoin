package org.a504.fitCoin.domain.shop.controller;

import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.shop.dto.response.AcquiredFurnitureInfo;
import org.a504.fitCoin.domain.shop.dto.response.GetItemsResponse;
import org.a504.fitCoin.domain.shop.dto.response.ItemResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchaseCoinFurnitureResponse;
import org.a504.fitCoin.domain.shop.dto.response.PurchasePointFurnitureResponse;
import org.a504.fitCoin.domain.shop.service.ShopService;
import org.a504.fitCoin.domain.shop.value.ShopErrorStatus;
import org.a504.fitCoin.domain.shop.value.ShopItem.PurchaseType;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.global.config.property.CorsConfigProperties;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.support.WithCustomUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    // ===== GET /shop/items =====

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

    // ===== POST /shop/gacha/furniture/point =====

    @Test
    @WithCustomUser
    void 포인트_가구_랜덤_뽑기_성공() throws Exception {
        AcquiredFurnitureInfo acquired = new AcquiredFurnitureInfo(
                12L, FurniturePosition.WINDOW, 3L, "벚꽃 창문", "https://cdn.example.com/furniture/12.png", true);
        PurchasePointFurnitureResponse response = new PurchasePointFurnitureResponse(300, 700, acquired, null);
        given(shopService.purchasePointFurniture(any())).willReturn(response);

        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.spentPoint").value(300))
                .andExpect(jsonPath("$.result.remainingPoint").value(700))
                .andExpect(jsonPath("$.result.acquiredFurniture.furnitureId").value(12))
                .andExpect(jsonPath("$.result.acquiredFurniture.position").value("WINDOW"))
                .andExpect(jsonPath("$.result.acquiredFurniture.themeId").value(3))
                .andExpect(jsonPath("$.result.acquiredFurniture.isNewAcquired").value(true))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture").doesNotExist());
    }

    @Test
    @WithCustomUser
    void 포인트_가구_랜덤_뽑기_성공_이미_보유한_가구_재획득() throws Exception {
        AcquiredFurnitureInfo acquired = new AcquiredFurnitureInfo(
                12L, FurniturePosition.WINDOW, 3L, "벚꽃 창문", "https://cdn.example.com/furniture/12.png", false);
        PurchasePointFurnitureResponse response = new PurchasePointFurnitureResponse(300, 700, acquired, null);
        given(shopService.purchasePointFurniture(any())).willReturn(response);

        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.acquiredFurniture.isNewAcquired").value(false))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture").doesNotExist());
    }

    @Test
    @WithCustomUser
    void 포인트_가구_랜덤_뽑기_성공_테마_완성으로_히든_가구_해금() throws Exception {
        AcquiredFurnitureInfo acquired = new AcquiredFurnitureInfo(
                12L, FurniturePosition.WINDOW, 3L, "벚꽃 창문", "https://cdn.example.com/furniture/12.png", true);
        AcquiredFurnitureInfo hidden = new AcquiredFurnitureInfo(
                20L, FurniturePosition.HIDDEN, 3L, "벚꽃 히든 아이템", "https://cdn.example.com/furniture/20.png", true);
        PurchasePointFurnitureResponse response = new PurchasePointFurnitureResponse(300, 700, acquired, hidden);
        given(shopService.purchasePointFurniture(any())).willReturn(response);

        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.acquiredFurniture.furnitureId").value(12))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture.furnitureId").value(20))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture.position").value("HIDDEN"));
    }

    @Test
    @WithCustomUser
    void 포인트_가구_랜덤_뽑기_포인트_부족_시_400_반환() throws Exception {
        given(shopService.purchasePointFurniture(any()))
                .willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_POINT));

        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("US4001"));
    }

    @Test
    @WithCustomUser
    void 포인트_가구_랜덤_뽑기_뽑을_가구_없는_경우_404_반환() throws Exception {
        given(shopService.purchasePointFurniture(any()))
                .willThrow(new CustomException(ShopErrorStatus.NO_FURNITURE_AVAILABLE));

        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("SH4041"));
    }

    @Test
    void 포인트_가구_랜덤_뽑기_인증_없이_요청하면_401_반환() throws Exception {
        mockMvc.perform(post("/shop/gacha/furniture/point").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    // ===== POST /shop/gacha/furniture/coin =====

    @Test
    @WithCustomUser
    void 코인_가구_랜덤_뽑기_성공() throws Exception {
        AcquiredFurnitureInfo acquired = new AcquiredFurnitureInfo(
                5L, FurniturePosition.WALLPAPER, 1L, "벚꽃 벽지", "https://cdn.example.com/furniture/5.png", true);
        PurchaseCoinFurnitureResponse response = new PurchaseCoinFurnitureResponse(10, 990, acquired, null);
        given(shopService.purchaseCoinFurniture(any())).willReturn(response);

        mockMvc.perform(post("/shop/gacha/furniture/coin").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.spentCoin").value(10))
                .andExpect(jsonPath("$.result.remainingCoin").value(990))
                .andExpect(jsonPath("$.result.acquiredFurniture.furnitureId").value(5))
                .andExpect(jsonPath("$.result.acquiredFurniture.position").value("WALLPAPER"))
                .andExpect(jsonPath("$.result.acquiredFurniture.isNewAcquired").value(true))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture").doesNotExist());
    }

    @Test
    @WithCustomUser
    void 코인_가구_랜덤_뽑기_성공_테마_완성으로_히든_가구_해금() throws Exception {
        AcquiredFurnitureInfo acquired = new AcquiredFurnitureInfo(
                5L, FurniturePosition.WALLPAPER, 1L, "벚꽃 벽지", "https://cdn.example.com/furniture/5.png", true);
        AcquiredFurnitureInfo hidden = new AcquiredFurnitureInfo(
                20L, FurniturePosition.HIDDEN, 1L, "벚꽃 히든 아이템", "https://cdn.example.com/furniture/20.png", true);
        PurchaseCoinFurnitureResponse response = new PurchaseCoinFurnitureResponse(10, 990, acquired, hidden);
        given(shopService.purchaseCoinFurniture(any())).willReturn(response);

        mockMvc.perform(post("/shop/gacha/furniture/coin").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture.furnitureId").value(20))
                .andExpect(jsonPath("$.result.unlockedHiddenFurniture.position").value("HIDDEN"));
    }

    @Test
    @WithCustomUser
    void 코인_가구_랜덤_뽑기_코인_부족_시_400_반환() throws Exception {
        given(shopService.purchaseCoinFurniture(any()))
                .willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_COIN));

        mockMvc.perform(post("/shop/gacha/furniture/coin").with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("US4002"));
    }

    @Test
    void 코인_가구_랜덤_뽑기_인증_없이_요청하면_401_반환() throws Exception {
        mockMvc.perform(post("/shop/gacha/furniture/coin").with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}