package org.a504.fitCoin.domain.shop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

public record PurchaseGifticonResponse(
        int spentCoin,
        int remainingCoin,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        AcquiredGifticonInfo acquiredGifticon
) {
}
