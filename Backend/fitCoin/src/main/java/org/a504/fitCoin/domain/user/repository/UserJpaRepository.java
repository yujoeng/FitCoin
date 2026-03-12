package org.a504.fitCoin.domain.user.repository;

import org.a504.fitCoin.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, Long> {
}
