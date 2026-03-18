package org.a504.fitCoin.domain.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import org.a504.fitCoin.global.validation.AlphaNumericSpecialCharOnly;
import org.a504.fitCoin.global.validation.PasswordComplexity;

public record ResetPasswordRequest(

        @NotBlank
        @AlphaNumericSpecialCharOnly
        @PasswordComplexity
        String password,

        @NotBlank
        String confirmPassword,

        @NotBlank
        String token
) {
    @AssertTrue(message = "Passwords don't match")
    @JsonIgnore
    public boolean isPasswordConfirmed() {
        return password != null && password.equals(confirmPassword);
    }
}
