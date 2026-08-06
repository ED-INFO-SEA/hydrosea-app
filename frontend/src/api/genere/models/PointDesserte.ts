/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentiteVersionnee } from './IdentiteVersionnee';
/**
 * Patrimoine en lecture ; le SIG reste maître des géométries.
 */
export type PointDesserte = (IdentiteVersionnee & {
    readonly identifiant_point_desserte: string;
    reference: string;
    identifiant_sig: string;
    statut: string;
    readonly version_sig?: string;
    readonly date_synchronisation?: string;
});

