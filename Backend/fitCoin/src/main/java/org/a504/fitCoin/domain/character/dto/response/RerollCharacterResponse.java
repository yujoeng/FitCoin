package org.a504.fitCoin.domain.character.dto.response;

public record RerollCharacterResponse(
        int spentCoin,
        int remainingCoin,
        CharacterInfo character
) {
    public record CharacterInfo(
            Long characterId,
            String characterName,
            String description,
            String imageUrl
    ) {
    }
}
