/**
 * http://api.northbricks.io/swagger/
 * 
 * @export
 * @interface Transaction
 */

export interface Amount {
    value: number;
    currency: string;
}

export interface RelatedParty {
    name: string;
}

export interface Transaction {
    id: string;
    type: string;
    description: string;
    bookingDate: Date;
    valueDate: Date;
    amount: Amount;
    relatedParty: RelatedParty;
}

