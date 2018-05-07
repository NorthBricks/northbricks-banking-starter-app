export interface Owner {
    name: string;
}

export interface Account {
    id: string;
    iban: string;
    type: string;
    owner: Owner;
    currency: string;
    balance: number;
}

export interface Accounts {
    accounts: Account[];
}