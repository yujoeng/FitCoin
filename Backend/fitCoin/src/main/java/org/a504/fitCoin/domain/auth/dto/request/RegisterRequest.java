package org.a504.fitCoin.domain.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;
import org.a504.fitCoin.global.validation.AlphaNumericSpecialCharOnly;
import org.a504.fitCoin.global.validation.Nickname;
import org.a504.fitCoin.global.validation.PasswordComplexity;

public record RegisterRequest(
        @NotBlank
        @Email
        String email,

        @NotBlank
        @Nickname
        String nickname,

        @NotBlank
        @AlphaNumericSpecialCharOnly
        @PasswordComplexity
        String password,

        @NotBlank
        String confirmPassword,

        @NotNull
        @JsonProperty("exercise_level")
        ExerciseLevel exerciseLevel,

        @NotBlank
        String token
) {
    @AssertTrue(message = "Passwords don't match")
    @JsonIgnore
    public boolean isPasswordConfirmed() {
        return password != null && password.equals(confirmPassword);
    }
}