package org.a504.fitCoin.domain.character.controller;

import org.a504.fitCoin.domain.character.dto.response.RerollCharacterResponse;
import org.a504.fitCoin.domain.character.exception.CharacterErrorStatus;
import org.a504.fitCoin.domain.character.service.CharacterService;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
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

@WebMvcTest(CharacterController.class)
@ActiveProfiles("test")
class CharacterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private CharacterService characterService;
    @MockitoBean private CorsConfigProperties corsConfigProperties;

    // ===== POST /characters/reroll =====

    @Test
    @WithCustomUser
    void 캐릭터_리롤_성공() throws Exception {
        RerollCharacterResponse response = new RerollCharacterResponse(
                1,
                99,
                new RerollCharacterResponse.CharacterInfo(
                        2L, "루미", "호기심 많은 탐험가", "https://cdn.example.com/characters/lumi.png"
                )
        );
        given(characterService.rerollCharacter(any())).willReturn(response);

        mockMvc.perform(post("/characters/reroll").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.spentCoin").value(1))
                .andExpect(jsonPath("$.result.remainingCoin").value(99))
                .andExpect(jsonPath("$.result.character.characterId").value(2))
                .andExpect(jsonPath("$.result.character.characterName").value("루미"))
                .andExpect(jsonPath("$.result.character.description").value("호기심 많은 탐험가"))
                .andExpect(jsonPath("$.result.character.imageUrl").value("https://cdn.example.com/characters/lumi.png"));
    }

    @Test
    @WithCustomUser
    void 캐릭터_리롤_코인_부족_시_400_반환() throws Exception {
        given(characterService.rerollCharacter(any()))
                .willThrow(new CustomException(UserErrorStatus.INSUFFICIENT_COIN));

        mockMvc.perform(post("/characters/reroll").with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("US4002"));
    }

    @Test
    @WithCustomUser
    void 캐릭터_리롤_활성_캐릭터_없을_때_404_반환() throws Exception {
        given(characterService.rerollCharacter(any()))
                .willThrow(new CustomException(CharacterErrorStatus.CHARACTER_NOT_ACTIVE));

        mockMvc.perform(post("/characters/reroll").with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("CHARACTER-404"));
    }

    @Test
    void 캐릭터_리롤_인증_없이_요청하면_401_반환() throws Exception {
        mockMvc.perform(post("/characters/reroll").with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}
