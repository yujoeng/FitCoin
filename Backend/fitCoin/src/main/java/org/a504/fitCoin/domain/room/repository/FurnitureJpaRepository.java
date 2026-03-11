package org.a504.fitCoin.domain.room.repository;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FurnitureJpaRepository extends JpaRepository<Furniture, Long> {
}
