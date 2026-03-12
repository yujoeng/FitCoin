package org.a504.fitCoin.domain.streak.repository;

import org.a504.fitCoin.domain.streak.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreakJpaRepository extends JpaRepository<Streak, Long> {
}
