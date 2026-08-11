/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreerParticipationContrat } from './CreerParticipationContrat';
import type { PreferencesFacturationContrat } from './PreferencesFacturationContrat';
import type { PreferencesReglementContrat } from './PreferencesReglementContrat';
export type CreerContratAbonnement = {
    date_demande: string;
    date_effet_souhaitee: string;
    date_fin_prevue?: string;
    nature_abonnement: string;
    identifiant_point_consommation: string;
    participants: Array<CreerParticipationContrat>;
    preferences_facturation?: PreferencesFacturationContrat;
    preferences_reglement?: PreferencesReglementContrat;
    references_documents?: Array<string>;
};

