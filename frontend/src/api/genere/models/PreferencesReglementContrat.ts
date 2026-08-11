/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Nomenclature initiale révisable avant implémentation après arbitrage métier.
 */
export type PreferencesReglementContrat = {
    moyen_souhaite?: PreferencesReglementContrat.moyen_souhaite;
    mensualisation_souhaitee?: boolean;
};
export namespace PreferencesReglementContrat {
    export enum moyen_souhaite {
        AUCUN = 'AUCUN',
        PRELEVEMENT = 'PRELEVEMENT',
        VIREMENT = 'VIREMENT',
        CHEQUE = 'CHEQUE',
        CARTE = 'CARTE',
        ESPECES = 'ESPECES',
        PAYFIP = 'PAYFIP',
    }
}

