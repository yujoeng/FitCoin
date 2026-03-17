package org.a504.fitCoin.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailVerifyConfirmRequest(
        
        String code,

        @NotBlank
        @Email
        String email
) {
}
