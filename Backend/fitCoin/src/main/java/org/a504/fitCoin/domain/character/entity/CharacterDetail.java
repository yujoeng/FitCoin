package org.a504.fitCoin.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.character.value.CharacterStatus;
import org.a504.fitCoin.global.entity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CharacterDetail extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private Characters characters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CharacterStatus status;

    @Column(name = "url")
    private String url;
}