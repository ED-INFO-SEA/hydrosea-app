/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Nomenclatures initiales révisables avant implémentation après arbitrage métier.
 */
export type PreferencesFacturationContrat = {
    canal?: PreferencesFacturationContrat.canal;
    frequence?: PreferencesFacturationContrat.frequence;
    regroupement_souhaite?: boolean;
};
export namespace PreferencesFacturationContrat {
    export enum canal {
        PAPIER = 'PAPIER',
        ELECTRONIQUE = 'ELECTRONIQUE',
        PORTAIL = 'PORTAIL',
    }
    export enum frequence {
        SELON_CYCLE = 'SELON_CYCLE',
        MENSUELLE = 'MENSUELLE',
        TRIMESTRIELLE = 'TRIMESTRIELLE',
        SEMESTRIELLE = 'SEMESTRIELLE',
        ANNUELLE = 'ANNUELLE',
    }
}

