package org.a504.fitCoin.domain.user.dto.response;

import org.a504.fitCoin.domain.user.value.ExerciseLevel;

public record MyPageResponse(

        String email,
        String nickname,
        ExerciseLevel exerciseLevel
) {
}
