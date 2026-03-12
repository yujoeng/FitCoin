package org.a504.fitCoin.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.wallet.value.GifticonType;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Gifticon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GifticonType type;

    /**
     * 0: 발급 불가, 1: 발급 가능
     */
    @Column(nullable = false, columnDefinition = "TINYINT DEFAULT 1")
    private int status;


}