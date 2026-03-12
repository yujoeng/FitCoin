package org.a504.fitCoin.domain.room.repository;

import org.a504.fitCoin.domain.room.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThemeJpaRepository extends JpaRepository<Theme, Long> {
}
