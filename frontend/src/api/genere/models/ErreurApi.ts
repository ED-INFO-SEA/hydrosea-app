/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErreurApi = {
    code: string;
    titre: string;
    detail: string;
    statut_http: number;
    identifiant_correlation: string;
    date_erreur: string;
    champ?: string;
    regle_metier?: string;
    service_metier?: string;
    erreurs_enfants?: Array<ErreurApi>;
};

