package org.a504.fitCoin.domain.streak.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a504.fitCoin.domain.user.entity.User;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Streak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @Column(name = "year_and_month", nullable = false)
    private LocalDate yearAndMonth; // 매월 1일로 저장 (e.g. 2026-03-01)

    @Column(nullable = false)
    private int data; // 비트마스킹: bit0=1일, bit1=2일, ..., bit30=31일

    public static Streak of(User user, LocalDate yearAndMonth) {
        Streak streak = new Streak();
        streak.user = user;
        streak.yearAndMonth = yearAndMonth;
        streak.data = 0;
        return streak;
    }

    // 특정 날짜 출석 체크 (bit ON)
    public void checkDay(int day) {
        this.data |= (1 << (day - 1));
    }

    // 특정 날짜 출석 여부 확인
    public boolean isChecked(int day) {
        return (this.data & (1 << (day - 1))) != 0;
    }
}