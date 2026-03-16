package org.a504.fitCoin.domain.wallet.dto;

import lombok.Builder;
import lombok.Getter;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.domain.wallet.entity.UserGifticon;
import org.a504.fitCoin.domain.wallet.value.GifticonType;
import java.time.LocalDateTime;

@Getter
@Builder
public class WalletResponseDto {

    private Long gifticonId;   // 보유 기프티콘 고유 ID
    private String imageUrl;    // 기프티콘 이미지 URL
    private GifticonType gifticonType; // 기프티콘 종류 (COFFEE, CHICKEN, BURGER)
    private LocalDateTime issuedAt;   // 획득 일시

    public static WalletResponseDto from(UserGifticon userGifticon) {
        Gifticon gifticon = userGifticon.getGifticon();
        return WalletResponseDto.builder()
                .gifticonId(userGifticon.getId())
                .imageUrl(gifticon.getUrl())
                .gifticonType(gifticon.getType())
                .issuedAt(userGifticon.getCreatedAt())
                .build();
    }
}