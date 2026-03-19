package org.a504.fitCoin.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.a504.fitCoin.global.validation.Nickname;

public record NicknameRequest(

        @NotBlank
        @Nickname
        String nickname
) {
}
