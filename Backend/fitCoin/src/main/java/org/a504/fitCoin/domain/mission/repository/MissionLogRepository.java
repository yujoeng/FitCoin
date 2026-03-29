package org.a504.fitCoin.domain.mission.repository;

import org.a504.fitCoin.domain.mission.entity.MissionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface MissionLogRepository extends JpaRepository<MissionLog, Long> {
    @Query("SELECT COUNT(ml) FROM MissionLog ml " +
            "WHERE ml.user.id = :userId " +
            "AND ml.createdAt >= :startOfDay " +
            "AND ml.createdAt < :endOfDay")
    int countByUserIdAndCreatedAtBetween(
            @Param("userId") Long userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    // 특정 날짜의 첫 번째 미션 완료 시각 조회 (입양일 경험치 분기용)
    @Query("SELECT MIN(ml.createdAt) FROM MissionLog ml " +
            "WHERE ml.user.id = :userId " +
            "AND ml.createdAt >= :startOfDay " +
            "AND ml.createdAt < :endOfDay")
    LocalDateTime findFirstMissionTimeByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}
