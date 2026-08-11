/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocalisationOperationnelle } from './LocalisationOperationnelle';
export type CreerPointDesserte = {
    /**
     * Identifiant interne du référentiel HydroSEA des communes, synchronisé avec le code INSEE.
     */
    identifiant_commune: string;
    /**
     * Clé interne HydroSEA de ref.adresse ; ce n’est jamais un identifiant BAN.
     */
    identifiant_adresse: string;
    references_parcelles?: Array<string>;
    localisation_operationnelle?: LocalisationOperationnelle;
    origine: string;
    date_creation_metier: string;
    reference_demande_travaux?: string;
};

