/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreerPaiement = {
    identifiant_tiers_payeur?: string;
    sens: CreerPaiement.sens;
    montant: number;
    moyen: string;
    date_valeur: string;
    reference_externe?: string;
    origine: string;
};
export namespace CreerPaiement {
    export enum sens {
        ENCAISSEMENT = 'ENCAISSEMENT',
        DECAISSEMENT = 'DECAISSEMENT',
    }
}

