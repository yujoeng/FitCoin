package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.user.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryJpaRepository extends JpaRepository<Inventory, Long> {

    // 유저가 특정 가구를 보유하고 있는지 확인
    boolean existsByUserIdAndFurnitureId(Long userId, Long furnitureId);
}
