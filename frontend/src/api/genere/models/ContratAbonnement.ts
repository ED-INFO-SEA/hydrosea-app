/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
import type { ParticipationContrat } from './ParticipationContrat';
export type ContratAbonnement = (IdentiteVersionnee & {
    readonly identifiant_contrat: string;
    readonly reference: string;
    readonly statut: string;
    date_effet?: string;
    date_fin?: string;
    date_resiliation?: string;
    /**
     * Projection de la liaison temporelle abo.liaison_contrat_consommation à l’instant courant.
     */
    readonly identifiant_point_consommation_courant?: string;
    participants?: Array<ParticipationContrat>;
});

