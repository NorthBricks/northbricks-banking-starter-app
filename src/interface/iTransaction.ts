export interface Amount {
    value: number;
    currency: string;
}

export interface RelatedParty {
    name: string;
}

export interface Transaction {
    id: string;
    description: string;
    bookingDate: Date;
    valueDate: Date;
    amount: Amount;
    relatedParty: RelatedParty;
}

export interface TransactionsRoot {
    transactions: Transaction[];
}