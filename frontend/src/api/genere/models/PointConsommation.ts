/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Adresse } from './Adresse';
import type { IdentiteVersionnee } from './IdentiteVersionnee';
export type PointConsommation = (IdentiteVersionnee & {
    readonly identifiant_point_consommation: string;
    readonly reference: string;
    readonly statut: PointConsommation.statut;
    usage?: string;
    identifiant_adresse?: string;
    adresse?: Adresse;
    /**
     * Projection de des.liaison_desserte_consommation à l’instant courant.
     */
    readonly identifiant_point_desserte_courant?: string;
});
export namespace PointConsommation {
    export enum statut {
        PREPARE = 'PREPARE',
        OUVERT = 'OUVERT',
        FERME = 'FERME',
    }
}

