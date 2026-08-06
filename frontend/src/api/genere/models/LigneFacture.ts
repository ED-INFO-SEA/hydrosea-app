/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type LigneFacture = (IdentiteVersionnee & {
    readonly identifiant_ligne_facture?: string;
    ordre: number;
    nature: string;
    libelle: string;
    quantite: number;
    prix_unitaire: number;
    montant_ttc: number;
});

