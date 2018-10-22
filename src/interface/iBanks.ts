/**
 * http://api.northbricks.io/swagger/
 * 
 * @export
 * @interface Banks
 */
export interface Bank {
    bic: string;
    shortName: string;
    fullName: string;
    logo: string;
    website: string;
}

export interface Banks {
    banks: Bank[];
}
