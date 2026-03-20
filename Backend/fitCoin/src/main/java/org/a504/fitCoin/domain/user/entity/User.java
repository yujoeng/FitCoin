package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;
import org.a504.fitCoin.domain.user.value.UserErrorStatus;
import org.a504.fitCoin.global.exception.CustomException;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_level")
    private ExerciseLevel exerciseLevel;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "point", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int point;

    @Column(name = "coin", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int coin;

    @Version
    private Long version;

    @Builder
    private User(String email, String password, String nickname, ExerciseLevel exerciseLevel) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.exerciseLevel = exerciseLevel;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void addPoint(int amount) {
        this.point += amount;
    }

    public void deductPoint(int amount) {
        if (this.point < amount) {
            throw new CustomException(UserErrorStatus.INSUFFICIENT_POINT);
        }
        this.point -= amount;
    }

    public void addCoin(int amount) {
        this.coin += amount;
    }

    public void deductCoin(int amount) {
        if (this.coin < amount) {
            throw new CustomException(UserErrorStatus.INSUFFICIENT_COIN);
        }
        this.coin -= amount;
    }
}