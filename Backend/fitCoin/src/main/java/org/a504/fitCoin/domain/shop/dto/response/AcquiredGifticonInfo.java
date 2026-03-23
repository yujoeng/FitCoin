package org.a504.fitCoin.domain.shop.dto.response;

import org.a504.fitCoin.domain.wallet.value.GifticonType;

public record AcquiredGifticonInfo(
        Long gifticonId,
        GifticonType gifticonType,
        String imageUrl
) {
}
