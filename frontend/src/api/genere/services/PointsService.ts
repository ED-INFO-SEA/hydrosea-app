/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffecterTourneeReleve } from '../models/AffecterTourneeReleve';
import type { ChangerDisponibilitePointDesserte } from '../models/ChangerDisponibilitePointDesserte';
import type { ChangerRattachementDesserte } from '../models/ChangerRattachementDesserte';
import type { CloturerRattachementDesserte } from '../models/CloturerRattachementDesserte';
import type { CorrigerAdressePointConsommation } from '../models/CorrigerAdressePointConsommation';
import type { CreerPointConsommation } from '../models/CreerPointConsommation';
import type { CreerPointDesserte } from '../models/CreerPointDesserte';
import type { CreerRattachementDesserte } from '../models/CreerRattachementDesserte';
import type { FermerPointConsommation } from '../models/FermerPointConsommation';
import type { ModifierLocalisationPointDesserte } from '../models/ModifierLocalisationPointDesserte';
import type { ModifierPointConsommation } from '../models/ModifierPointConsommation';
import type { OuvrirPointConsommation } from '../models/OuvrirPointConsommation';
import type { PagePointsConsommation } from '../models/PagePointsConsommation';
import type { PagePointsDesserte } from '../models/PagePointsDesserte';
import type { PointConsommation } from '../models/PointConsommation';
import type { PointDesserte } from '../models/PointDesserte';
import type { ReouvrirPointConsommation } from '../models/ReouvrirPointConsommation';
import type { RetirerPointDesserte } from '../models/RetirerPointDesserte';
import type { SynchroniserPointDesserteSig } from '../models/SynchroniserPointDesserteSig';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PointsService {
    /**
     * Rechercher des Points de desserte
     * Recherche les identités administratives des Points de desserte selon les critères autorisés. Cette lecture prospective restitue les corrélations SIG et localisations projetées disponibles sans interroger ni modifier directement le patrimoine SIG, les Points de consommation ou les compteurs.
     * @returns PagePointsDesserte Succès
     * @throws ApiError
     */
    public static rechercherPointsDesserte(): CancelablePromise<PagePointsDesserte> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-desserte',
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
     * Créer un Point de desserte
     * Crée l’identité administrative HydroSEA d’un Point de desserte à partir d’une commune, d’une adresse et, éventuellement, d’une localisation opérationnelle sourcée. Cette écriture prospective ne crée ni corrélation SIG, ni géométrie patrimoniale dans le SIG, ni Point de consommation, ni compteur.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static creerPointDesserte({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerPointDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte',
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
     * Consulter un Point de desserte
     * Restitue l’identité, le cycle de vie administratif, l’adresse historisée, la localisation opérationnelle et l’éventuelle corrélation SIG d’un Point de desserte. Cette lecture prospective ne garantit pas à elle seule l’état du patrimoine réalisé dans le SIG et ne modifie aucune donnée.
     * @returns PointDesserte Succès
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
     * Synchroniser un Point de desserte avec le SIG
     * Enregistre ou met à jour, après contrôle de l’identité HydroSEA, la corrélation avec l’identifiant du référentiel SIG et les projections autorisées. Cette écriture prospective ne rend pas HydroSEA maître du patrimoine réalisé ni des géométries patrimoniales, qui restent sous la responsabilité du SIG.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static synchroniserPointDesserteSig({
        identifiantPointDesserte,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointDesserte: string,
        idempotencyKey: string,
        requestBody: SynchroniserPointDesserteSig,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/{identifiant_point_desserte}/synchroniser-sig',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
            },
            headers: {
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * Rendre un Point de desserte disponible
     * Fait passer un Point de desserte créé ou indisponible à l’état disponible après vérification de sa situation administrative et, lorsque requis, de sa corrélation avec le patrimoine réalisé. Cette écriture prospective n’ouvre aucun Point de consommation et n’active ni contrat ni compteur.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static rendreDisponiblePointDesserte({
        identifiantPointDesserte,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointDesserte: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: ChangerDisponibilitePointDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/{identifiant_point_desserte}/rendre-disponible',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Rendre un Point de desserte indisponible
     * Place un Point de desserte disponible dans un état temporairement indisponible avec une date d’effet et un motif contrôlés. Cette écriture prospective ne ferme pas les Points de consommation rattachés, ne résilie aucun contrat et ne modifie pas le patrimoine SIG.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static rendreIndisponiblePointDesserte({
        identifiantPointDesserte,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointDesserte: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: ChangerDisponibilitePointDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/{identifiant_point_desserte}/rendre-indisponible',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Retirer un Point de desserte
     * Prononce le retrait administratif définitif d’un Point de desserte lorsque aucun rattachement actif ne l’interdit et conserve son historique. Cette écriture prospective ne supprime pas le patrimoine SIG, ne ferme pas implicitement un Point de consommation et ne dépose aucun compteur.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static retirerPointDesserte({
        identifiantPointDesserte,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointDesserte: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: RetirerPointDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/{identifiant_point_desserte}/retirer',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Corriger la localisation d’un Point de desserte
     * Historise une correction de l’adresse administrative ou de la localisation opérationnelle sourcée d’un Point de desserte. Cette écriture prospective ne remplace ni ne corrige la géométrie patrimoniale réalisée dont le SIG reste maître et ne change aucun rattachement de consommation.
     * @returns PointDesserte Succès
     * @throws ApiError
     */
    public static corrigerLocalisationPointDesserte({
        identifiantPointDesserte,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointDesserte: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: ModifierLocalisationPointDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointDesserte> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-desserte/{identifiant_point_desserte}/corriger-localisation',
            path: {
                'identifiant_point_desserte': identifiantPointDesserte,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Rechercher des Points de consommation
     * Recherche les unités administratives de consommation selon leur état, leur usage, leur adresse de situation ou leur rattachement historisé. Cette lecture prospective ne restitue pas de titulaire ou de compteur direct et ne modifie ni contrat, ni facturation, ni adresse de Tiers.
     * @returns PagePointsConsommation Succès
     * @throws ApiError
     */
    public static rechercherPointsConsommation(): CancelablePromise<PagePointsConsommation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/points-consommation',
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
     * Créer un Point de consommation
     * Prépare une nouvelle unité administrative de consommation avec son usage, son adresse de situation et, si elle est connue, une première période de rattachement à une desserte. Cette écriture prospective ne crée ni contrat d’abonnement, ni titulaire, ni compteur et n’ouvre pas automatiquement le Point.
     * @returns PointConsommation Succès
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
     * Restitue l’identité administrative, l’état, l’usage, l’adresse de situation et les rattachements historisés d’un Point de consommation. Cette lecture prospective ne présente ni titulaire ni compteur comme attribut direct et n’altère aucun contrat ou document de facturation.
     * @returns PointConsommation Succès
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
     * Modifier les caractéristiques d’un Point de consommation
     * Met à jour les caractéristiques administratives autorisées d’un Point de consommation après contrôle de version et historise la date d’effet. Cette écriture prospective ne change pas son état, son rattachement, l’adresse d’un Tiers, l’adresse de facturation d’un Contrat ni l’affectation d’un compteur.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static modifierPointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
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
                'Idempotency-Key': idempotencyKey,
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
     * Fait passer un Point de consommation préparé à l’état ouvert après contrôle de son rattachement à une desserte disponible et de sa situation administrative. Cette écriture prospective n’active pas automatiquement un Contrat d’abonnement et ne pose ni n’affecte aucun compteur.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static ouvrirPointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: OuvrirPointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/ouvrir',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Fermer un Point de consommation
     * Fait passer un Point de consommation ouvert à l’état fermé à la date d’effet motivée, sans supprimer le Point ni son historique. Cette écriture prospective ne résilie pas automatiquement les contrats, ne dépose ni ne désaffecte les compteurs et conserve toutes les périodes antérieures.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static fermerPointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: FermerPointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/fermer',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Réouvrir un Point de consommation
     * Fait repasser un Point de consommation fermé à l’état ouvert après contrôle du motif, de la date d’effet et d’un rattachement valide à une desserte disponible. Cette écriture prospective ne réactive aucun contrat résilié et ne réaffecte aucun compteur.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static reouvrirPointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: ReouvrirPointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/reouvrir',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Rattacher un Point de consommation à une desserte
     * Ouvre une période de rattachement entre un Point de consommation et un Point de desserte disponible, après contrôle de l’absence de chevauchement temporel. Cette écriture prospective ne déplace pas de compteur, ne modifie pas de contrat et ne crée aucune géométrie SIG.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static rattacherPointConsommationDesserte({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: CreerRattachementDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/rattachements-desserte',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Clôturer un rattachement à une desserte
     * Ferme à la date d’effet la période active reliant un Point de consommation à son Point de desserte, tout en conservant l’historique. Cette écriture prospective ne ferme pas le Point de consommation, ne résilie aucun contrat et ne modifie aucun compteur.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static cloturerRattachementDesserte({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: CloturerRattachementDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/rattachements-desserte/cloturer',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Changer le rattachement à une desserte
     * Clôture le rattachement actif puis ouvre, à la même date d’effet, une période vers une nouvelle desserte disponible sans chevauchement. Cette écriture prospective ne transfère pas automatiquement les contrats ou compteurs et ne modifie pas les géométries SIG.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static changerRattachementDesserte({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: ChangerRattachementDesserte,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/changer-rattachement-desserte',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Affecter un Point de consommation à une tournée de relève
     * Enregistre l’identifiant de tournée et le rang opérationnel du Point de consommation après contrôle du référentiel de tournées. Cette écriture prospective n’affecte aucun compteur, ne crée aucune relève et ne modifie ni desserte ni contrat.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static affecterTourneeRelevePointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: AffecterTourneeReleve,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/affecter-tournee',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
     * Corriger l’adresse de situation d’un Point de consommation
     * Historise la correction de l’adresse de situation administrative du Point de consommation à partir d’une référence interne vers ref.adresse et, à titre de projection, d’un identifiant BAN distinct. Cette écriture prospective ne modifie aucune adresse postale ou de correspondance d’un Tiers, ni aucune adresse de facturation ou d’envoi d’un Contrat ou document.
     * @returns PointConsommation Succès
     * @throws ApiError
     */
    public static corrigerAdressePointConsommation({
        identifiantPointConsommation,
        ifMatch,
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPointConsommation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        idempotencyKey: string,
        requestBody: CorrigerAdressePointConsommation,
        xCorrelationId?: string,
    }): CancelablePromise<PointConsommation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/points-consommation/{identifiant_point_consommation}/corriger-adresse',
            path: {
                'identifiant_point_consommation': identifiantPointConsommation,
            },
            headers: {
                'If-Match': ifMatch,
                'X-Correlation-Id': xCorrelationId,
                'Idempotency-Key': idempotencyKey,
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
}
