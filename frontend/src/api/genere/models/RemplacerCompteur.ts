/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RemplacerCompteur = {
    identifiant_compteur_entrant: string;
    date_remplacement: string;
    index_depose: number;
    index_pose: number;
    unite: string;
    qualite_index_depose?: string;
    qualite_index_pose?: string;
    motif: string;
    reference_intervention: string;
    devenir_compteur_sortant?: RemplacerCompteur.devenir_compteur_sortant;
};
export namespace RemplacerCompteur {
    export enum devenir_compteur_sortant {
        EN_STOCK = 'EN_STOCK',
        EN_CONTROLE = 'EN_CONTROLE',
        HORS_SERVICE = 'HORS_SERVICE',
        REFORME = 'REFORME',
    }
}

