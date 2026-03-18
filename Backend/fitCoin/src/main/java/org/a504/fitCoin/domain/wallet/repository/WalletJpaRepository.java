package org.a504.fitCoin.domain.wallet.repository;

import org.a504.fitCoin.domain.user.entity.UserGifticon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WalletJpaRepository extends JpaRepository<UserGifticon, Long> {

    List<UserGifticon> findByUser_Id(Long userId);

}
