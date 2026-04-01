package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.a504.fitCoin.domain.asset.value.CoinReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CoinLogJpaRepository extends JpaRepository<CoinLog, Long> {

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM CoinLog c WHERE DATE(c.createdAt) = :date AND c.reason = :reason")
    long sumAddedCoinsByDate(@Param("date") LocalDate date, @Param("reason") CoinReason reason);

    @Query("""
            SELECT c.user.id,
                   SUM(CASE WHEN c.reason IN :earnReasons THEN c.amount ELSE -c.amount END)
            FROM CoinLog c
            GROUP BY c.user.id
            """)
    List<Object[]> findNetCoinBalancePerUser(@Param("earnReasons") List<CoinReason> earnReasons);
}
