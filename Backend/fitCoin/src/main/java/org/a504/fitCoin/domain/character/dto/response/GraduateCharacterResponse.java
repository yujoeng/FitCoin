package org.a504.fitCoin.domain.character.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GraduateCharacterResponse {

    private String graduatedImageUrl;

    public static GraduateCharacterResponse of(String graduatedImgUrl) {
        return GraduateCharacterResponse.builder()
                .graduatedImageUrl(graduatedImgUrl)
                .build();
    }
}
