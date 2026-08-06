/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErreurApi } from './ErreurApi';
export type BilanImportReleves = {
    identifiant_import: string;
    nombre_lignes: number;
    nombre_acceptees: number;
    nombre_rejetees: number;
    resultats: Array<{
        numero_ligne: number;
        statut: 'ACCEPTEE' | 'REJETEE';
        erreur?: ErreurApi;
    }>;
};

