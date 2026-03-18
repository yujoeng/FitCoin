package org.a504.fitCoin.domain.character.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdoptCharacterResponse {

    private Long characterId;
    private String name;
    private String imgUrl;

    public static AdoptCharacterResponse of(Long characterId, String name, String imgUrl) {
        return AdoptCharacterResponse.builder()
                .characterId(characterId)
                .name(name)
                .imgUrl(imgUrl)
                .build();
    }

}
