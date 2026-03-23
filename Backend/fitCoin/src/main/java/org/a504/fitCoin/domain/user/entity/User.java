package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.user.value.ExerciseLevel;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateExerciseLevel(ExerciseLevel exerciseLevel) {
        this.exerciseLevel = exerciseLevel;
    }

    public void addPoint(int amount) {
        this.point += amount;
    }
}