/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreerPaiement } from '../models/CreerPaiement';
import type { ImputationPaiement } from '../models/ImputationPaiement';
import type { ImputerPaiement } from '../models/ImputerPaiement';
import type { PagePaiements } from '../models/PagePaiements';
import type { Paiement } from '../models/Paiement';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaiementsService {
    /**
     * Rechercher des paiements
     * Recherche paginée par référence, statut, Tiers payeur ou période.
     * @returns PagePaiements Page de paiements
     * @throws ApiError
     */
    public static rechercherPaiements({
        page,
        taillePage,
        reference,
        statut,
        identifiantTiers,
    }: {
        page?: number,
        taillePage?: number,
        reference?: string,
        statut?: string,
        identifiantTiers?: string,
    }): CancelablePromise<PagePaiements> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/paiements',
            query: {
                'page': page,
                'taille_page': taillePage,
                'reference': reference,
                'statut': statut,
                'identifiant_tiers': identifiantTiers,
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
     * Enregistrer un paiement
     * Enregistre un paiement idempotent par clé et référence externe.
     * @returns Paiement Paiement enregistré
     * @throws ApiError
     */
    public static enregistrerPaiement({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerPaiement,
        xCorrelationId?: string,
    }): CancelablePromise<Paiement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/paiements',
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
     * Consulter un paiement
     * Retourne le paiement et son montant restant disponible.
     * @returns Paiement Paiement trouvé
     * @throws ApiError
     */
    public static consulterPaiement({
        identifiantPaiement,
    }: {
        identifiantPaiement: string,
    }): CancelablePromise<Paiement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/paiements/{identifiant_paiement}',
            path: {
                'identifiant_paiement': identifiantPaiement,
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
     * Imputer un paiement
     * Répartit le montant sur plusieurs factures sous contrôle bilatéral des plafonds.
     * @returns ImputationPaiement Imputations validées
     * @throws ApiError
     */
    public static imputerPaiement({
        identifiantPaiement,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPaiement: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ImputerPaiement,
        xCorrelationId?: string,
    }): CancelablePromise<Array<ImputationPaiement>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/paiements/{identifiant_paiement}/imputer',
            path: {
                'identifiant_paiement': identifiantPaiement,
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
     * Contrepasser une imputation de paiement
     * Crée une contrepassation identique sans supprimer l’imputation d’origine.
     * @returns ImputationPaiement Contrepassation créée
     * @throws ApiError
     */
    public static contrepasserImputationPaiement({
        identifiantPaiement,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPaiement: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            identifiant_imputation: string;
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<ImputationPaiement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/paiements/{identifiant_paiement}/contrepasser-imputation',
            path: {
                'identifiant_paiement': identifiantPaiement,
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
     * Rembourser un paiement
     * Commande un décaissement lié ; les conditions définitives relèvent de BS-PAI-002.
     * @returns Paiement Remboursement enregistré
     * @throws ApiError
     */
    public static rembourserPaiement({
        identifiantPaiement,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantPaiement: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            montant: number;
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Paiement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/paiements/{identifiant_paiement}/rembourser',
            path: {
                'identifiant_paiement': identifiantPaiement,
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
}
