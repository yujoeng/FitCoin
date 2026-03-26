package org.a504.fitCoin.domain.asset.value;

public enum CoinReason {
    EXCHANGE(TransactionType.EARN),
    CHARACTER_REROLL(TransactionType.USE),
    FURNITURE_GACHA(TransactionType.USE),
    GIFTICON_GACHA(TransactionType.USE);

    public final TransactionType transactionType;

    CoinReason(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
}
