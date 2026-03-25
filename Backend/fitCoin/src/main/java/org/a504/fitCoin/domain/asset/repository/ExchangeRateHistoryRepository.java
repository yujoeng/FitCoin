package org.a504.fitCoin.domain.asset.repository;

import org.a504.fitCoin.domain.asset.dto.ExchangeRateHistoryResponse;

import java.util.List;

public interface ExchangeRateHistoryRepository {

    boolean exists();

    void addAll(List<ExchangeRateHistoryResponse> entries);

    List<ExchangeRateHistoryResponse> getAll();

    void delete();
}
