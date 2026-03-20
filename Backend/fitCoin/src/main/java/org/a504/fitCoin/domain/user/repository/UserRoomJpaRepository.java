package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.user.entity.UserRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRoomJpaRepository extends JpaRepository<UserRoom, Long> {

    // userId 로 UserRoom 을 조회하면서 Furniture 한 번에 가져옴 (N+1 문제 방지)
    // JOIN FETCH : 연관된 데이터를 한 번의 쿼리로 같이 가져옴
    @Query("""
            SELECT r FROM UserRoom r
            LEFT JOIN FETCH r.wallItem
            LEFT JOIN FETCH r.floorItem
            LEFT JOIN FETCH r.windowItem
            LEFT JOIN FETCH r.leftItem
            LEFT JOIN FETCH r.rightItem
            LEFT JOIN FETCH r.hiddenItem
            WHERE r.user.id = :userId
            """)
    Optional<UserRoom> findByUserIdWithFurnitures(@Param("userId") Long userId);
}