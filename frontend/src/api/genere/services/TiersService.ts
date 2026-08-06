/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreerTiers } from '../models/CreerTiers';
import type { ModifierTiers } from '../models/ModifierTiers';
import type { PageTiers } from '../models/PageTiers';
import type { Tiers } from '../models/Tiers';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TiersService {
    /**
     * Rechercher des Tiers
     * Recherche multicritère et détection indicative de doublons ; la décision de fusion reste métier.
     * @returns PageTiers Page de Tiers
     * @throws ApiError
     */
    public static rechercherTiers({
        page = 1,
        taillePage = 20,
        recherche,
        reference,
        categorie,
        statut,
    }: {
        page?: number,
        taillePage?: number,
        recherche?: string,
        reference?: string,
        categorie?: 'PERSONNE_PHYSIQUE' | 'PERSONNE_MORALE',
        statut?: string,
    }): CancelablePromise<PageTiers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/tiers',
            query: {
                'page': page,
                'taille_page': taillePage,
                'recherche': recherche,
                'reference': reference,
                'categorie': categorie,
                'statut': statut,
            },
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Créer un Tiers
     * Crée atomiquement un Tiers personne physique ou morale et contrôle les doublons probables.
     * @returns Tiers Tiers créé
     * @throws ApiError
     */
    public static creerTiers({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerTiers,
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/tiers',
            headers: {
                'Idempotency-Key': idempotencyKey,
                'X-Correlation-Id': xCorrelationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Consulter un Tiers
     * Retourne la représentation autorisée du Tiers sans données internes inutiles.
     * @returns Tiers Tiers trouvé
     * @throws ApiError
     */
    public static consulterTiers({
        identifiantTiers,
        xCorrelationId,
    }: {
        identifiantTiers: string,
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/tiers/{identifiant_tiers}',
            path: {
                'identifiant_tiers': identifiantTiers,
            },
            headers: {
                'X-Correlation-Id': xCorrelationId,
            },
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                404: `Ressource absente.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Modifier un Tiers
     * Modifie les attributs autorisés selon la version attendue ; schéma PATCH spécifique à finaliser avec l’application.
     * @returns Tiers Tiers modifié
     * @throws ApiError
     */
    public static modifierTiers({
        identifiantTiers,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantTiers: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ModifierTiers,
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/tiers/{identifiant_tiers}',
            path: {
                'identifiant_tiers': identifiantTiers,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                404: `Ressource absente.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                412: `Version If-Match non satisfaite.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Fusionner deux Tiers
     * Conserve le Tiers cible et archive le doublon selon RM-TIE ; la sélection automatique du survivant n’est pas définie.
     * @returns Tiers Tiers conservé
     * @throws ApiError
     */
    public static fusionnerTiers({
        identifiantTiers,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantTiers: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            identifiant_tiers_conserve: string;
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/tiers/{identifiant_tiers}/fusionner',
            path: {
                'identifiant_tiers': identifiantTiers,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                404: `Ressource absente.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                412: `Version If-Match non satisfaite.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Archiver un Tiers
     * Archive le Tiers lorsque les dépendances métier l’autorisent.
     * @returns Tiers Tiers archivé
     * @throws ApiError
     */
    public static archiverTiers({
        identifiantTiers,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantTiers: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/tiers/{identifiant_tiers}/archiver',
            path: {
                'identifiant_tiers': identifiantTiers,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                404: `Ressource absente.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                412: `Version If-Match non satisfaite.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
    /**
     * Réactiver un Tiers
     * Réactive un Tiers archivé lorsque la règle métier l’autorise.
     * @returns Tiers Tiers réactivé
     * @throws ApiError
     */
    public static reactiverTiers({
        identifiantTiers,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantTiers: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<Tiers> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/tiers/{identifiant_tiers}/reactiver',
            path: {
                'identifiant_tiers': identifiantTiers,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
            },
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                404: `Ressource absente.`,
                409: `Conflit métier ou clé d’idempotence réutilisée avec une empreinte différente.`,
                412: `Version If-Match non satisfaite.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
}
