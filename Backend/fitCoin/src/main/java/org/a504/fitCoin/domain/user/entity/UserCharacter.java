package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.a504.fitCoin.domain.character.entity.Characters;
import org.a504.fitCoin.domain.user.value.UserCharacterStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCharacter {

    private static final int MAX_EXP = 10;

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

    @Setter
    @Column(name = "last_updated_date")
    private LocalDate lastUpdatedDate;

    @Builder
    public UserCharacter(User user, Characters characters) {
        this.user = user;
        this.characters = characters;
        this.exp = 0;                               // 입양 시 경험치 0
        this.status = UserCharacterStatus.GROWING;  // 입양 시 "키우는 중" 상태
        this.adoptionDate = LocalDateTime.now();    // 입양일 자동 설정
        this.lastUpdatedDate = LocalDate.now();     // 마지막 경험치 업데이트일 자동 설정
    }

    // lastUpdatedDate 오늘로 갱신
    public void updateLastUpdatedDate() {
        this.lastUpdatedDate = LocalDate.now();
    }

    // 졸업 처리 메서드
    public void graduate() {
        this.status = UserCharacterStatus.GRADUATED;
        this.graduationDate = LocalDateTime.now();
    }

    // 리롤: 캐릭터 교체 및 상태 초기화
    public void reroll(Characters newCharacter) {
        this.characters = newCharacter;
        this.exp = 0;
        this.status = UserCharacterStatus.GROWING;
        this.adoptionDate = LocalDateTime.now();
        this.lastUpdatedDate = LocalDate.now();
    }
}