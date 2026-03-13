package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.character.entity.Characters;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private Characters characters;

    @Column(name = "exp", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int exp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserCharacterStatus status = UserCharacterStatus.GROWING;;

    @Column(name = "adoption_date")
    private LocalDateTime adoptionDate;

    @Column(name = "graduation_date")
    private LocalDateTime graduationDate;
}