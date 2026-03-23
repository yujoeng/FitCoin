package org.a504.fitCoin.domain.streak.repository;

import org.a504.fitCoin.domain.streak.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StreakJpaRepository extends JpaRepository<Streak, Long> {

    // 특정 월 스트릭 조회
    @Query("SELECT s FROM Streak s WHERE s.user.id = :userId AND s.yearAndMonth = :yearAndMonth")
    Optional<Streak> findByUserIdAndYearAndMonth(
            @Param("userId") Long userId,
            @Param("yearAndMonth") LocalDate yearAndMonth
    );

    // 특정 기간 스트릭 목록 조회 (연속 스트릭 계산용)
    @Query("SELECT s FROM Streak s WHERE s.user.id = :userId " +
            "AND s.yearAndMonth >= :from AND s.yearAndMonth <= :to " +
            "ORDER BY s.yearAndMonth DESC")
    List<Streak> findByUserIdAndMonthBetween(
            @Param("userId") Long userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}