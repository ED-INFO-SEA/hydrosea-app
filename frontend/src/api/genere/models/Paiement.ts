/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type Paiement = (IdentiteVersionnee & {
    readonly identifiant_paiement: string;
    readonly reference: string;
    identifiant_tiers_payeur?: string;
    sens: Paiement.sens;
    montant: number;
    readonly montant_disponible?: number;
    moyen: string;
    date_valeur: string;
    reference_externe?: string;
    statut: string;
    origine: string;
});
export namespace Paiement {
    export enum sens {
        ENCAISSEMENT = 'ENCAISSEMENT',
        DECAISSEMENT = 'DECAISSEMENT',
    }
}

