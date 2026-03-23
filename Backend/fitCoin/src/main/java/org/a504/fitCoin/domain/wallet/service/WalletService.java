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
    public WalletResponseDto getMyGifticons(Long userId) {
        List<WalletResponseDto.GifticonDto> gifticons = walletJpaRepository.findByUser_Id(userId)
                .stream()
                .map(WalletResponseDto.GifticonDto::from)
                .collect(Collectors.toList());

        return WalletResponseDto.of(gifticons);
    }

}
