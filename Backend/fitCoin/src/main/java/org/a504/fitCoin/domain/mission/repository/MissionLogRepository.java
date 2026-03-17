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
}
