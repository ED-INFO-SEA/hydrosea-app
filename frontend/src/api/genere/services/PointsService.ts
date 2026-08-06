/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreerPointConsommation } from '../models/CreerPointConsommation';
import type { ModifierPointConsommation } from '../models/ModifierPointConsommation';
import type { PagePointsConsommation } from '../models/PagePointsConsommation';
import type { PagePointsDesserte } from '../models/PagePointsDesserte';
import type { PointConsommation } from '../models/PointConsommation';
import type { PointDesserte } from '../models/PointDesserte';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PointsService {
    /**
     * Rechercher des Points de desserte
     * Recherche le patrimoine synchronisé ; le SIG reste maître.
     * @returns PagePointsDesserte Page de Points de desserte
     * @throws ApiError
     */
    public static rechercherPointsDesserte({
        page,
        taillePage,
        reference,
        statut,
    }: {
        page?: number,
        taillePage?: number,
        reference?: string,
        statut?: string,
    }): CancelablePromise<PagePointsDesserte> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-desserte',
            query: {
                'page': page,
                'taille_page': taillePage,
                'reference': reference,
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
     * Consulter un Point de desserte
     * Retourne les attributs synchronisés sans opération patrimoniale d’écriture.
     * @returns PointDesserte Point trouvé
     * @throws ApiError
     */
    public static consulterPointDesserte({
        identifiantPointDesserte,
    }: {
        identifiantPointDesserte: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-desserte/{identifiant_point_desserte}',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
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
     * Synchroniser les Points de desserte depuis le SIG
     * Importe les changements du référentiel maître sans modifier le SIG.
     * @returns any Synchronisation acceptée
     * @throws ApiError
     */
    public static synchroniserPointsDesserteSig({
        idempotencyKey,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        xCorrelationId?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/synchroniser-sig',
            headers: {
                'Idempotency-Key': idempotencyKey,
                'X-Correlation-Id': xCorrelationId,
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
     * Rechercher des Points de consommation
     * Recherche paginée par référence, statut et usage.
     * @returns PagePointsConsommation Page de Points
     * @throws ApiError
     */
    public static rechercherPointsConsommation({
        page,
        taillePage,
        reference,
        statut,
    }: {
        page?: number,
        taillePage?: number,
        reference?: string,
        statut?: string,
    }): CancelablePromise<PagePointsConsommation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-consommation',
            query: {
                'page': page,
                'taille_page': taillePage,
                'reference': reference,
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
     * Créer un Point de consommation
     * Prépare administrativement le Point relié au patrimoine SIG.
     * @returns PointConsommation Point créé
     * @throws ApiError
     */
    public static creerPointConsommation({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerPointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation',
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
     * Consulter un Point de consommation
     * Retourne le Point et ses références patrimoniales.
     * @returns PointConsommation Point trouvé
     * @throws ApiError
     */
    public static consulterPointConsommation({
        identifiantPointConsommation,
    }: {
        identifiantPointConsommation: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-consommation/{identifiant_point_consommation}',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
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
     * Modifier un Point de consommation
     * Modifie uniquement les attributs non patrimoniaux autorisés.
     * @returns PointConsommation Point modifié
     * @throws ApiError
     */
    public static modifierPointConsommation({
        identifiantPointConsommation,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ModifierPointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/points-consommation/{identifiant_point_consommation}',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
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
     * Ouvrir un Point de consommation
     * Fait passer le Point préparé à l’état ouvert.
     * @returns PointConsommation Point ouvert
     * @throws ApiError
     */
    public static ouvrirPointConsommation({
        identifiantPointConsommation,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/ouvrir',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
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
    /**
     * Fermer un Point de consommation
     * Ferme le Point selon une décision métier explicite.
     * @returns PointConsommation Point fermé
     * @throws ApiError
     */
    public static fermerPointConsommation({
        identifiantPointConsommation,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/fermer',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
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
    /**
     * Réouvrir un Point de consommation
     * Réouvre le Point lorsque la transition est autorisée ; le cycle définitif reste à arbitrer.
     * @returns PointConsommation Point réouvert
     * @throws ApiError
     */
    public static reouvrirPointConsommation({
        identifiantPointConsommation,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/reouvrir',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
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
