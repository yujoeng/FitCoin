package org.a504.fitCoin.domain.room.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.a504.fitCoin.global.entity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Furniture extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id", nullable = false)
    private Theme theme;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "url")
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FurniturePosition position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseType type;

}