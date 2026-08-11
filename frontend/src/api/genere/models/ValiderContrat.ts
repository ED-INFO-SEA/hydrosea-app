/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ValiderContrat = {
    decision: ValiderContrat.decision;
    motif_retour?: string;
    references_documents?: Array<string>;
};
export namespace ValiderContrat {
    export enum decision {
        VALIDER = 'VALIDER',
        RETOURNER_BROUILLON = 'RETOURNER_BROUILLON',
    }
}

