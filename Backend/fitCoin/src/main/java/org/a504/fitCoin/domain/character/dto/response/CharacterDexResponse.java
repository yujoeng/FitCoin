package org.a504.fitCoin.domain.character.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.a504.fitCoin.domain.character.entity.Characters;

import java.util.List;

@Getter
@Builder
public class CharacterDexResponse {

    private Long characterId;
    private String name;
    private String description;
    private List<String> imgs;

    public static CharacterDexResponse of(Characters character, List<String> imgs) {
        return CharacterDexResponse.builder()
                .characterId(character.getId())
                .name(character.getName())
                .description(character.getDescription())
                .imgs(imgs)
                .build();
    }
}
