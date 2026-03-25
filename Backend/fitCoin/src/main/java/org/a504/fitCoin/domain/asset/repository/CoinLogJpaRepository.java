package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.a504.fitCoin.domain.asset.value.TransactionType;

import java.time.LocalDate;

public interface CoinLogJpaRepository extends JpaRepository<CoinLog, Long> {

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM CoinLog c WHERE DATE(c.createdAt) = :date AND c.type = :type")
    long sumAddedCoinsByDate(@Param("date") LocalDate date, @Param("type") TransactionType type);
}
