package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.entity.PointLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointLogJpaRepository extends JpaRepository<PointLog, Long> {
}
