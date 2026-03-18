package org.a504.fitCoin.domain.character.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import org.a504.fitCoin.domain.user.entity.UserCharacter;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;

@Getter
@Builder
public class CharacterResponse {

    private Long characterId;
    private String imgUrl;
    private int currentExp;
    @JsonProperty("isGraduatable")
    private boolean graduatable;

    public static CharacterResponse of(UserCharacter userCharacter, String imgUrl) {
        return CharacterResponse.builder()
                .characterId(userCharacter.getCharacters().getId())
                .imgUrl(imgUrl)
                .currentExp(userCharacter.getExp())
                .graduatable(userCharacter.getStatus() == UserCharacterStatus.AVAILABLE)
                .build();
    }
}