/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SynchroniserPointDesserteSig = {
    systeme_source: string;
    identifiant_sig: string;
    version_sig: string;
    date_synchronisation: string;
    resultat: SynchroniserPointDesserteSig.resultat;
    motif_rejet?: string;
};
export namespace SynchroniserPointDesserteSig {
    export enum resultat {
        CORRELE = 'CORRELE',
        MIS_A_JOUR = 'MIS_A_JOUR',
        REJETE = 'REJETE',
    }
}

