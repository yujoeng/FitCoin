package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.room.entity.Furniture;
import org.a504.fitCoin.domain.user.entity.User;
import org.a504.fitCoin.domain.user.entity.UserFurniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface UserFurnitureJpaRepository extends JpaRepository<UserFurniture, Long> {

    boolean existsByUserAndFurniture(User user, Furniture furniture);

    @Query("SELECT uf.furniture.id FROM UserFurniture uf WHERE uf.user.id = :userId")
    Set<Long> findFurnitureIdsByUserId(@Param("userId") Long userId);
}
