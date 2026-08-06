/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coordonnee } from './Coordonnee';
import type { IdentiteVersionnee } from './IdentiteVersionnee';
import type { PersonneMorale } from './PersonneMorale';
import type { PersonnePhysique } from './PersonnePhysique';
/**
 * Représentation minimisée de BO-001. Voir le dictionnaire de données et RM-TIE.
 */
export type Tiers = (IdentiteVersionnee & {
    readonly identifiant_tiers: string;
    readonly reference: string;
    readonly categorie: Tiers.categorie;
    readonly statut: string;
    personne_physique?: PersonnePhysique;
    personne_morale?: PersonneMorale;
    coordonnees?: Array<Coordonnee>;
});
export namespace Tiers {
    export enum categorie {
        PERSONNE_PHYSIQUE = 'PERSONNE_PHYSIQUE',
        PERSONNE_MORALE = 'PERSONNE_MORALE',
    }
}

