/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Corrige uniquement l’adresse de situation administrative du Point de consommation, sans modifier une adresse de Tiers, de Contrat, de facturation ou d’envoi.
 */
export type CorrigerAdressePointConsommation = {
    /**
     * Clé interne HydroSEA de ref.adresse.
     */
    identifiant_adresse: string;
    /**
     * Identifiant externe BAN facultatif associé à l’adresse ; distinct de la clé HydroSEA.
     */
    identifiant_ban?: string;
    source: string;
    date_effet: string;
    motif: string;
};

