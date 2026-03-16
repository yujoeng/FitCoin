package org.a504.fitCoin.domain.wallet.service;

import lombok.RequiredArgsConstructor;
import org.a504.fitCoin.domain.wallet.dto.WalletResponseDto;
import org.a504.fitCoin.domain.wallet.repository.WalletJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletJpaRepository walletJpaRepository;

    @Transactional(readOnly = true)
    public List<WalletResponseDto> getMyGifticons(Long userId) {
        return walletJpaRepository.findByUser_Id(userId)
                .stream()
                .map(WalletResponseDto::from)
                .collect(Collectors.toList());
    }

}
