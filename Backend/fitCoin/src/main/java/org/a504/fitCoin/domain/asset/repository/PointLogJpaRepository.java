package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.PointLog;
import org.a504.fitCoin.domain.asset.value.PointReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PointLogJpaRepository extends JpaRepository<PointLog, Long> {

    @Query("""
            SELECT p.user.id,
                   SUM(CASE WHEN p.reason IN :earnReasons THEN p.amount ELSE -p.amount END)
            FROM PointLog p
            GROUP BY p.user.id
            """)
    List<Object[]> findNetPointBalancePerUser(@Param("earnReasons") List<PointReason> earnReasons);
}
