package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.a504.fitCoin.domain.asset.value.CoinReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface CoinLogJpaRepository extends JpaRepository<CoinLog, Long> {

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM CoinLog c WHERE DATE(c.createdAt) = :date AND c.reason = :reason")
    long sumAddedCoinsByDate(@Param("date") LocalDate date, @Param("reason") CoinReason reason);
}
