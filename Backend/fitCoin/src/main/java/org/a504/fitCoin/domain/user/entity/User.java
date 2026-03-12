package org.a504.fitCoin.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
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
}