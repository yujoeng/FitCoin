package org.a504.fitCoin.domain.advertisement.controller;

import org.a504.fitCoin.domain.advertisement.dto.response.StartAdResponse;
import org.a504.fitCoin.domain.advertisement.service.AdvertisementService;
import org.a504.fitCoin.domain.advertisement.value.AdErrorStatus;
import org.a504.fitCoin.global.config.property.CorsConfigProperties;
import org.a504.fitCoin.global.exception.CustomException;
import org.a504.fitCoin.support.WithCustomUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdvertisementController.class)
@ActiveProfiles("test")
class AdvertisementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private AdvertisementService advertisementService;
    @MockitoBean private CorsConfigProperties corsConfigProperties;

    @Test
    @WithCustomUser
    void 광고_시청_시작_성공() throws Exception {
        given(advertisementService.startAd(any())).willReturn(new StartAdResponse("https://example.com/ad"));

        mockMvc.perform(post("/ads/start").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.adUrl").value("https://example.com/ad"));
    }

    @Test
    @WithCustomUser
    void 오늘_이미_시청한_경우_400_반환() throws Exception {
        given(advertisementService.startAd(any()))
                .willThrow(new CustomException(AdErrorStatus.AD_ALREADY_WATCHED_TODAY));

        mockMvc.perform(post("/ads/start").with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AD4001"));
    }

    @Test
    @WithCustomUser
    void 이미_진행_중인_광고가_있는_경우_409_반환() throws Exception {
        given(advertisementService.startAd(any()))
                .willThrow(new CustomException(AdErrorStatus.AD_ALREADY_IN_PROGRESS));

        mockMvc.perform(post("/ads/start").with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AD4091"));
    }

    @Test
    void 인증_없이_요청하면_401_반환() throws Exception {
        mockMvc.perform(post("/ads/start").with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}
