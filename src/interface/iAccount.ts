export interface Owner {
    name: string;
}

export interface Account {
    id: number;
    iban: string;
    owner: Owner;
}