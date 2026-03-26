package org.a504.fitCoin.domain.character.service;

import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.a504.fitCoin.domain.asset.repository.CoinLogJpaRepository;
import org.a504.fitCoin.domain.character.dto.response.RerollCharacterResponse;
import org.a504.fitCoin.domain.character.entity.CharacterDetail;
import org.a504.fitCoin.domain.character.entity.Characters;
import org.a504.fitCoin.domain.character.exception.CharacterErrorStatus;
import org.a504.fitCoin.domain.character.repository.CharacterDetailJpaRepository;
import org.a504.fitCoin.domain.character.repository.CharacterJpaRepository;
import org.a504.fitCoin.domain.character.value.CharacterStatus;
import org.a504.fitCoin.domain.streak.repository.StreakJpaRepository;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.entity.UserCharacter;
import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.a504.fitCoin.domain.user.repository.UserCharacterJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserGifticonJpaRepository;
import org.a504.fitCoin.domain.user.repository.UserJpaRepository;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.domain.wallet.repository.GifticonJpaRepository;
import org.a504.fitCoin.global.exception.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterServiceTest {

    @Mock private CharacterJpaRepository characterJpaRepository;
    @Mock private CharacterDetailJpaRepository characterDetailJpaRepository;
    @Mock private UserCharacterJpaRepository userCharacterJpaRepository;
    @Mock private UserJpaRepository userJpaRepository;
    @Mock private GifticonJpaRepository gifticonJpaRepository;
    @Mock private UserGifticonJpaRepository userGifticonJpaRepository;
    @Mock private StreakJpaRepository streakJpaRepository;
    @Mock private CoinLogJpaRepository coinLogJpaRepository;

    @InjectMocks
    private CharacterService characterService;

    private static final Long USER_ID = 1L;

    // ===== rerollCharacter =====

    @Test
    void rerollCharacter_성공() {
        User user = mock(User.class);
        UserCharacter userCharacter = mock(UserCharacter.class);
        Characters newCharacter = mock(Characters.class);
        CharacterDetail detail = mock(CharacterDetail.class);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(userCharacterJpaRepository.findByUserIdAndStatusNot(USER_ID, UserCharacterStatus.GRADUATED))
                .willReturn(Optional.of(userCharacter));
        given(characterJpaRepository.findAll()).willReturn(List.of(newCharacter));
        given(newCharacter.getPercentage()).willReturn(100.0);
        given(newCharacter.getId()).willReturn(2L);
        given(newCharacter.getName()).willReturn("루미");
        given(newCharacter.getDescription()).willReturn("호기심 많은 탐험가");
        given(characterDetailJpaRepository.findByCharactersIdAndStatus(2L, CharacterStatus.DEFAULT))
                .willReturn(Optional.of(detail));
        given(detail.getUrl()).willReturn("https://cdn.example.com/characters/lumi.png");
        given(coinLogJpaRepository.save(any(CoinLog.class))).willAnswer(inv -> inv.getArgument(0));
        given(user.getCoin()).willReturn(99);

        RerollCharacterResponse response = characterService.rerollCharacter(USER_ID);

        assertThat(response.spentCoin()).isEqualTo(1);
        assertThat(response.remainingCoin()).isEqualTo(99);
        assertThat(response.character().characterId()).isEqualTo(2L);
        assertThat(response.character().characterName()).isEqualTo("루미");
        assertThat(response.character().description()).isEqualTo("호기심 많은 탐험가");
        assertThat(response.character().imageUrl()).isEqualTo("https://cdn.example.com/characters/lumi.png");

        verify(user).deductCoin(1);
        verify(userCharacter).reroll(newCharacter);
    }

    @Test
    void rerollCharacter_이미지_없을_때_imageUrl_null_반환() {
        User user = mock(User.class);
        UserCharacter userCharacter = mock(UserCharacter.class);
        Characters newCharacter = mock(Characters.class);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(userCharacterJpaRepository.findByUserIdAndStatusNot(USER_ID, UserCharacterStatus.GRADUATED))
                .willReturn(Optional.of(userCharacter));
        given(characterJpaRepository.findAll()).willReturn(List.of(newCharacter));
        given(newCharacter.getPercentage()).willReturn(100.0);
        given(newCharacter.getId()).willReturn(2L);
        given(newCharacter.getName()).willReturn("루미");
        given(newCharacter.getDescription()).willReturn("호기심 많은 탐험가");
        given(characterDetailJpaRepository.findByCharactersIdAndStatus(2L, CharacterStatus.DEFAULT))
                .willReturn(Optional.empty());
        given(coinLogJpaRepository.save(any(CoinLog.class))).willAnswer(inv -> inv.getArgument(0));

        RerollCharacterResponse response = characterService.rerollCharacter(USER_ID);

        assertThat(response.character().imageUrl()).isNull();
    }

    @Test
    void rerollCharacter_활성_캐릭터_없으면_예외_발생() {
        User user = mock(User.class);
        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(userCharacterJpaRepository.findByUserIdAndStatusNot(USER_ID, UserCharacterStatus.GRADUATED))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> characterService.rerollCharacter(USER_ID))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getErrorCode())
                .isEqualTo(CharacterErrorStatus.CHARACTER_NOT_ACTIVE);
    }

    @Test
    void rerollCharacter_코인_부족하면_예외_발생() {
        User user = mock(User.class);
        UserCharacter userCharacter = mock(UserCharacter.class);

        given(userJpaRepository.findByIdWithLock(USER_ID)).willReturn(Optional.of(user));
        given(userCharacterJpaRepository.findByUserIdAndStatusNot(USER_ID, UserCharacterStatus.GRADUATED))
                .willReturn(Optional.of(userCharacter));
        doThrow(new CustomException(UserErrorStatus.INSUFFICIENT_COIN)).when(user).deductCoin(1);

        assertThatThrownBy(() -> characterService.rerollCharacter(USER_ID))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getErrorCode())
                .isEqualTo(UserErrorStatus.INSUFFICIENT_COIN);
    }
}
