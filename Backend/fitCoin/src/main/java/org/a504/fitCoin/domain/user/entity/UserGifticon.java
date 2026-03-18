package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.wallet.entity.Gifticon;
import org.a504.fitCoin.global.entity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserGifticon extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gifticon_id")
    private Gifticon gifticon;

    @Builder
    public UserGifticon(User user, Gifticon gifticon) {
        this.user = user;
        this.gifticon = gifticon;
    }
}