/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PoserCompteur = {
    identifiant_point_consommation: string;
    date_pose: string;
    index_pose: number;
    unite: string;
    qualite_index?: PoserCompteur.qualite_index;
    motif: string;
    reference_intervention: string;
    agent_ou_entreprise?: string;
    scelle?: string;
    sens_pose?: string;
    fonction_affectation?: string;
};
export namespace PoserCompteur {
    export enum qualite_index {
        LU = 'LU',
        ESTIME = 'ESTIME',
    }
}

