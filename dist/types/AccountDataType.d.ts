export type AccountDataType = {
    data: {
        address: {
            city: string;
            country: string;
            streetAddress: string;
            streetAddressNumber: string;
            zip: string;
        };
        bankAccount: {
            bankAccountId: number;
            bic: string;
            iban: string;
            status: string;
        };
        canUpgrade: boolean;
        cellphoneNumber: string;
        clientRole: string;
        contractType: string;
        culture: string;
        displayName: string;
        effectiveClientRole: string;
        email: string;
        firstContact: {
            countryOfBirth: string;
            dateOfBirth: string;
            displayName: string;
            firstName: string;
            gender: string;
            lastName: string;
            nationality: string;
            placeOfBirth: string;
        };
        id: number;
        intAccount: number;
        isAllocationAvailable: boolean;
        isAmClientActive: boolean;
        isCollectivePortfolio: boolean;
        isIskClient: boolean;
        isWithdrawalAvailable: boolean;
        language: string;
        locale: string;
        memberCode: string;
        username: string;
    };
};
//# sourceMappingURL=AccountDataType.d.ts.map