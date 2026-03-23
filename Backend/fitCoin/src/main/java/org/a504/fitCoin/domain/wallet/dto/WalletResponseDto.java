package org.a504.fitCoin.domain.wallet.dto;

import lombok.Builder;
import lombok.Getter;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.a504.fitCoin.domain.wallet.value.GifticonType;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class WalletResponseDto {

    private List<GifticonDto> gifticons;

    public static WalletResponseDto of(List<GifticonDto> gifticons) {
        return WalletResponseDto.builder()
                .gifticons(gifticons)
                .build();
    }

    @Getter
    @Builder
    public static class GifticonDto {

        private Long gifticonId;
        private GifticonType gifticonType;
        private String imageUrl;
        private LocalDateTime issuedAt;

        // GifticonDto 변환
        public static GifticonDto from(UserGifticon userGifticon) {
            Gifticon gifticon = userGifticon.getGifticon();
            return GifticonDto.builder()
                    .gifticonId(userGifticon.getId())
                    .gifticonType(gifticon.getType())
                    .imageUrl(gifticon.getUrl())
                    .issuedAt(userGifticon.getCreatedAt())
                    .build();
        }
    }
}