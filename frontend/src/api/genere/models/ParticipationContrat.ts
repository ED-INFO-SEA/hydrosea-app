/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type ParticipationContrat = (IdentiteVersionnee & {
    readonly identifiant_participation?: string;
    identifiant_tiers: string;
    role_contractuel: string;
    principal: boolean;
    responsabilite_financiere?: boolean;
    date_debut_validite: string;
    date_fin_validite?: string;
    motif_fin?: string;
});

