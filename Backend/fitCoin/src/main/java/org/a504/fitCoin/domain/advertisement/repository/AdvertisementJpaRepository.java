package org.a504.fitCoin.domain.advertisement.repository;

import org.a504.fitCoin.domain.advertisement.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdvertisementJpaRepository extends JpaRepository<Advertisement, Long> {
}
