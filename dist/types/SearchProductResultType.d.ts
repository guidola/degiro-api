export type SearchProductResultType = {
    id: string;
    name: string;
    isin: string;
    symbol: string;
    contractSize: number;
    productType: string;
    productTypeId: number;
    tradable: boolean;
    category: string;
    currency: string;
    exchangeId: string;
    orderTimeTypes: string[];
    gtcAllowed: boolean;
    buyOrderTypes: string[];
    sellOrderTypes: string[];
    marketAllowed: boolean;
    limitHitOrderAllowed: boolean;
    stoplossAllowed: boolean;
    stopLimitOrderAllowed: boolean;
    joinOrderAllowed: boolean;
    trailingStopOrderAllowed: boolean;
    combinedOrderAllowed: boolean;
    sellAmountAllowed: boolean;
    isFund: boolean;
    closePrice: number;
    closePriceDate: string;
    feedQuality: string;
    orderBookDepth: number;
    vwdIdentifierType: string;
    vwdId: string;
    qualitySwitchable: boolean;
    qualitySwitchFree: boolean;
    vwdModuleId: number;
    feedQualitySecondary: string;
    orderBookDepthSecondary: number;
    vwdIdentifierTypeSecondary: string;
    vwdIdSecondary: string;
    qualitySwitchableSecondary: boolean;
    qualitySwitchFreeSecondary: boolean;
    vwdModuleIdSecondary: number;
};
//# sourceMappingURL=SearchProductResultType.d.ts.map