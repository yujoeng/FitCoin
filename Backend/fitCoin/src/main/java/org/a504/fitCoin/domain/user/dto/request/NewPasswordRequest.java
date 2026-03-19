package org.a504.fitCoin.domain.user.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import org.a504.fitCoin.global.validation.AlphaNumericSpecialCharOnly;
import org.a504.fitCoin.global.validation.PasswordComplexity;

public record NewPasswordRequest(

        @NotBlank
        @AlphaNumericSpecialCharOnly
        @PasswordComplexity
        String password,

        @NotBlank
        @AlphaNumericSpecialCharOnly
        @PasswordComplexity
        String newPassword,

        @NotBlank
        String confirmPassword
) {
    @AssertTrue(message = "Passwords don't match")
    @JsonIgnore
    public boolean isPasswordConfirmed() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }

    @AssertTrue(message = "이전 비밀번호와 다르게 입력해주십시오.")
    @JsonIgnore
    public boolean isNewPasswordDifferentFromCurrent() {
        return newPassword != null && !newPassword.equals(password);
    }
}
