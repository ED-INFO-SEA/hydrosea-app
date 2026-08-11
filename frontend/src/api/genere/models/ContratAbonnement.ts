/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
import type { ParticipationContrat } from './ParticipationContrat';
import type { PreferencesFacturationContrat } from './PreferencesFacturationContrat';
import type { PreferencesReglementContrat } from './PreferencesReglementContrat';
export type ContratAbonnement = (IdentiteVersionnee & {
    readonly identifiant_contrat: string;
    readonly reference: string;
    readonly statut: ContratAbonnement.statut;
    nature_abonnement?: string;
    date_demande?: string;
    date_effet?: string;
    date_fin?: string;
    date_resiliation?: string;
    /**
     * Projection de la liaison temporelle abo.liaison_contrat_consommation à l’instant courant.
     */
    readonly identifiant_point_consommation_courant?: string;
    participants?: Array<ParticipationContrat>;
    preferences_facturation?: PreferencesFacturationContrat;
    preferences_reglement?: PreferencesReglementContrat;
});
export namespace ContratAbonnement {
    export enum statut {
        BROUILLON = 'BROUILLON',
        A_VALIDER = 'A_VALIDER',
        VALIDE = 'VALIDE',
        ACTIF = 'ACTIF',
        SUSPENDU = 'SUSPENDU',
        RESILIE = 'RESILIE',
        ANNULE = 'ANNULE',
    }
}

