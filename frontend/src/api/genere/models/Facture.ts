/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
import type { LigneFacture } from './LigneFacture';
export type Facture = (IdentiteVersionnee & {
    readonly identifiant_facture: string;
    readonly numero: string;
    identifiant_contrat: string;
    type_piece: Facture.type_piece;
    identifiant_facture_origine?: string;
    periode_debut: string;
    periode_fin: string;
    statut: string;
    montant_ht?: number;
    montant_taxe?: number;
    montant_ttc: number;
    lignes?: Array<LigneFacture>;
});
export namespace Facture {
    export enum type_piece {
        FACTURE = 'FACTURE',
        AVOIR = 'AVOIR',
        CORRECTION = 'CORRECTION',
    }
}

