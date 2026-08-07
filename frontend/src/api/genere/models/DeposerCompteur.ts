/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DeposerCompteur = {
    date_depose: string;
    index_depose?: number;
    unite?: string;
    qualite_index?: DeposerCompteur.qualite_index;
    justification_index_absent?: string;
    motif: string;
    reference_intervention: string;
    devenir: DeposerCompteur.devenir;
};
export namespace DeposerCompteur {
    export enum qualite_index {
        LU = 'LU',
        ESTIME = 'ESTIME',
        ILLISIBLE = 'ILLISIBLE',
        ABSENT = 'ABSENT',
    }
    export enum devenir {
        EN_STOCK = 'EN_STOCK',
        EN_CONTROLE = 'EN_CONTROLE',
        HORS_SERVICE = 'HORS_SERVICE',
        REFORME = 'REFORME',
    }
}

