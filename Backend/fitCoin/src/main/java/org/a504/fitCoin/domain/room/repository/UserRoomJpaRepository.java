package org.a504.fitCoin.domain.room.repository;

import org.a504.fitCoin.domain.room.entity.UserRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoomJpaRepository extends JpaRepository<UserRoom, Long> {
}