/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculerFacture } from '../models/CalculerFacture';
import type { Facture } from '../models/Facture';
import type { LigneFacture } from '../models/LigneFacture';
import type { PageFactures } from '../models/PageFactures';
import type { Releve } from '../models/Releve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacturationService {
    /**
     * Rechercher des factures
     * Recherche paginée par contrat, statut, référence et période.
     * @returns PageFactures Page de factures
     * @throws ApiError
     */
    public static rechercherFactures({
        page,
        taillePage,
        reference,
        statut,
        dateDebut,
        dateFin,
    }: {
        page?: number,
        taillePage?: number,
        reference?: string,
        statut?: string,
        dateDebut?: string,
        dateFin?: string,
    }): CancelablePromise<PageFactures> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/factures',
            query: {
                'page': page,
                'taille_page': taillePage,
                'reference': reference,
                'statut': statut,
                'date_debut': dateDebut,
                'date_fin': dateFin,
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
     * Calculer des brouillons de facture
     * Commande le calcul sans définir la tarification dans OpenAPI.
     * @returns any Calcul accepté
     * @throws ApiError
     */
    public static calculerFactures({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CalculerFacture,
        xCorrelationId?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/factures/calculer',
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
     * Consulter une facture
     * Retourne la pièce et ses montants sans document binaire.
     * @returns Facture Facture trouvée
     * @throws ApiError
     */
    public static consulterFacture({
        identifiantFacture,
    }: {
        identifiantFacture: string,
    }): CancelablePromise<Facture> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/factures/{identifiant_facture}',
            path: {
                'identifiant_facture': identifiantFacture,
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
     * Émettre une facture
     * Fige et émet un brouillon validé ; la diffusion documentaire reste à arbitrer.
     * @returns Facture Facture émise
     * @throws ApiError
     */
    public static emettreFacture({
        identifiantFacture,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantFacture: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<Facture> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/factures/{identifiant_facture}/emettre',
            path: {
                'identifiant_facture': identifiantFacture,
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
     * Corriger une facture
     * Crée une pièce de correction ou un avoir lié ; le lettrage définitif reste à arbitrer.
     * @returns Facture Pièce de correction créée
     * @throws ApiError
     */
    public static corrigerFacture({
        identifiantFacture,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantFacture: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            type_piece: 'AVOIR' | 'CORRECTION';
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Facture> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/factures/{identifiant_facture}/corriger',
            path: {
                'identifiant_facture': identifiantFacture,
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
     * Annuler une facture
     * Annule la pièce selon son état et conserve l’historique.
     * @returns Facture Facture annulée
     * @throws ApiError
     */
    public static annulerFacture({
        identifiantFacture,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantFacture: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Facture> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/factures/{identifiant_facture}/annuler',
            path: {
                'identifiant_facture': identifiantFacture,
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
     * Consulter les lignes d’une facture
     * Retourne le détail figé de la pièce.
     * @returns LigneFacture Lignes
     * @throws ApiError
     */
    public static consulterLignesFacture({
        identifiantFacture,
    }: {
        identifiantFacture: string,
    }): CancelablePromise<Array<LigneFacture>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/factures/{identifiant_facture}/lignes',
            path: {
                'identifiant_facture': identifiantFacture,
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
     * Consulter les relèves d’une facture
     * Retourne les mesures figées utilisées comme preuves de calcul.
     * @returns Releve Relèves de la facture
     * @throws ApiError
     */
    public static consulterRelevesFacture({
        identifiantFacture,
    }: {
        identifiantFacture: string,
    }): CancelablePromise<Array<Releve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/factures/{identifiant_facture}/releves',
            path: {
                'identifiant_facture': identifiantFacture,
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
}
