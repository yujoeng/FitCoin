package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.CoinLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinLogJpaRepository extends JpaRepository<CoinLog, Long> {
}
