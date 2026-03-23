package org.a504.fitCoin.domain.room.repository;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.room.entity.Theme;
import org.a504.fitCoin.domain.room.value.FurniturePosition;
import org.a504.fitCoin.domain.room.value.PurchaseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FurnitureJpaRepository extends JpaRepository<Furniture, Long> {

    List<Furniture> findAllByType(PurchaseType type);

    List<Furniture> findAllByThemeAndPositionNot(Theme theme, FurniturePosition position);

    Optional<Furniture> findByThemeAndPosition(Theme theme, FurniturePosition position);
}
