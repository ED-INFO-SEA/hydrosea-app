/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonneMorale } from './PersonneMorale';
import type { PersonnePhysique } from './PersonnePhysique';
/**
 * Une et une seule spécialisation complète est obligatoire. RM-TIE-003 contrôle sa compatibilité avec la catégorie existante.
 */
export type ModifierTiers = ({
    personne_physique: PersonnePhysique;
} | {
    personne_morale: PersonneMorale;
});

