export type TransactionType = {
    buysell: string;
    counterParty: string;
    date: string;
    id: number;
    orderTypeId: number;
    price: number;
    productId: number;
    quantity: number;
    total: number;
    fxRate?: number;
    nettFxRate?: number;
    grossFxRate?: number;
    autoFxFeeInBaseCurrency?: number;
    totalInBaseCurrency: number;
    feeInBaseCurrency?: number;
    totalFeesInBaseCurrency?: number;
    totalPlusFeeInBaseCurrency: number;
    totalPlusAllFeesInBaseCurrency?: number;
    tradingVenue: string;
    transactionTypeId: number;
    transfered: boolean;
    executingEntityId?: string;
};
//# sourceMappingURL=TransactionType.d.ts.map