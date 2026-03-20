package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.user.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryJpaRepository extends JpaRepository<Inventory, Long> {

    // 유저가 특정 가구를 보유하고 있는지 확인
    boolean existsByUserIdAndFurnitureId(Long userId, Long furnitureId);

    // 유저의 인벤토리 조회 시 가구, 테마 정보를 한 번에 가져옴 (N+1 문제 방지)
    @Query("""
            SELECT i FROM Inventory i
            JOIN FETCH i.furniture f
            JOIN FETCH f.theme
            WHERE i.user.id = :userId
            """)
    List<Inventory> findAllByUserIdWithFurniture(@Param("userId") Long userId);
}
