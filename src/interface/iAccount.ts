export interface Owner {
    name: string;
}

export interface Account {
    id: string;
    iban: string;
    type: string;
    owner: Owner;
}

export interface Accounts {
    accounts: Account[];
}