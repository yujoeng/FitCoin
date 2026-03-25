package org.a504.fitCoin.domain.asset.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.global.entity.BaseTimeEntity;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Exchange extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rate;

    @Column(nullable = false)
    private double ewma;

    @Column(nullable = false, unique = true)
    private LocalDate baseDate;

    @Builder
    public Exchange(LocalDate baseDate, int rate, double ewma) {
        this.baseDate = baseDate;
        this.rate = rate;
        this.ewma = ewma;
    }
}