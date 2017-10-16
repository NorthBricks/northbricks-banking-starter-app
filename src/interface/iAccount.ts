export interface Owner {
    name: string;
}

export interface Account {
    id: string;
    iban: string;
    owner: Owner;
}