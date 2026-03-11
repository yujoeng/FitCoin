package org.a504.fitCoin.domain.mission.repository;

import org.a504.fitCoin.domain.mission.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MissionJpaRepository extends JpaRepository<Mission, Long> {
}
