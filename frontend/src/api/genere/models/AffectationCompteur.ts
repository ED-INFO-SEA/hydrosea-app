/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type AffectationCompteur = (IdentiteVersionnee & {
    readonly identifiant_affectation?: string;
    identifiant_compteur: string;
    identifiant_point_consommation: string;
    date_debut_validite: string;
    date_fin_validite?: string;
    index_pose?: number;
    index_depose?: number;
    statut: string;
});

