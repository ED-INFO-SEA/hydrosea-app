/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type ImputationPaiement = (IdentiteVersionnee & {
    readonly identifiant_imputation?: string;
    identifiant_paiement: string;
    identifiant_facture: string;
    montant: number;
    readonly date_imputation?: string;
    identifiant_imputation_origine?: string;
    statut: ImputationPaiement.statut;
});
export namespace ImputationPaiement {
    export enum statut {
        VALIDEE = 'VALIDEE',
        CONTREPASSEE = 'CONTREPASSEE',
    }
}

