package org.a504.fitCoin.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;

public record ExerciseLevelRequest(

        @NotNull
        ExerciseLevel exerciseLevel
) {
}
