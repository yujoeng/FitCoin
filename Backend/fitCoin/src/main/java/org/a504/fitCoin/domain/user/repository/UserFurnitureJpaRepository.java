package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.user.entity.UserFurniture;
import org.a504.fitCoin.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface UserFurnitureJpaRepository extends JpaRepository<UserFurniture, Long> {

    boolean existsByUserAndFurniture(User user, Furniture furniture);

    @Query("SELECT uf.furniture.id FROM UserFurniture uf WHERE uf.user.id = :userId")
    Set<Long> findFurnitureIdsByUserId(@Param("userId") Long userId);

    // 유저가 특정 가구를 보유하고 있는지 확인
    boolean existsByUserIdAndFurnitureId(Long userId, Long furnitureId);

    // 유저의 인벤토리 조회 시 가구, 테마 정보를 한 번에 가져옴 (N+1 문제 방지)
    @Query("""
            SELECT i FROM UserFurniture i
            JOIN FETCH i.furniture f
            JOIN FETCH f.theme
            WHERE i.user.id = :userId
            """)
    List<UserFurniture> findAllByUserIdWithFurniture(@Param("userId") Long userId);
}
