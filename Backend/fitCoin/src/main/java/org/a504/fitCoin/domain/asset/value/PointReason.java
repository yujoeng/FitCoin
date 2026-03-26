package org.a504.fitCoin.domain.asset.value;

public enum PointReason {
    AD_REWARD(TransactionType.EARN),
    FURNITURE_GACHA(TransactionType.USE),
    EXCHANGE(TransactionType.USE);

    public final TransactionType transactionType;

    PointReason(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
}
