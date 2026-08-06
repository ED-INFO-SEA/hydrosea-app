/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffectationCompteur } from '../models/AffectationCompteur';
import type { BilanImportReleves } from '../models/BilanImportReleves';
import type { Compteur } from '../models/Compteur';
import type { CorrigerReleve } from '../models/CorrigerReleve';
import type { CreerAffectationCompteur } from '../models/CreerAffectationCompteur';
import type { CreerCompteur } from '../models/CreerCompteur';
import type { CreerReleve } from '../models/CreerReleve';
import type { ModifierCompteur } from '../models/ModifierCompteur';
import type { PageAffectationsCompteur } from '../models/PageAffectationsCompteur';
import type { PageCompteurs } from '../models/PageCompteurs';
import type { PageReleves } from '../models/PageReleves';
import type { Releve } from '../models/Releve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ComptageService {
    /**
     * Rechercher des compteurs
     * Recherche paginée par numéro de série et statut.
     * @returns PageCompteurs Page de compteurs
     * @throws ApiError
     */
    public static rechercherCompteurs({
        page,
        taillePage,
        reference,
        statut,
    }: {
        page?: number,
        taillePage?: number,
        reference?: string,
        statut?: string,
    }): CancelablePromise<PageCompteurs> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/compteurs',
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
     * Enregistrer un compteur
     * Enregistre un compteur dans le parc sans l’affecter à un Point.
     * @returns Compteur Compteur enregistré
     * @throws ApiError
     */
    public static enregistrerCompteur({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerCompteur,
        xCorrelationId?: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs',
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
     * Consulter un compteur
     * Retourne le compteur et son état courant.
     * @returns Compteur Compteur trouvé
     * @throws ApiError
     */
    public static consulterCompteur({
        identifiantCompteur,
    }: {
        identifiantCompteur: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/compteurs/{identifiant_compteur}',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Modifier un compteur
     * Corrige les caractéristiques autorisées sans modifier une affectation.
     * @returns Compteur Compteur modifié
     * @throws ApiError
     */
    public static modifierCompteur({
        identifiantCompteur,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantCompteur: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ModifierCompteur,
        xCorrelationId?: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/compteurs/{identifiant_compteur}',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Poser un compteur
     * Crée ou active l’affectation au Point de consommation.
     * @returns AffectationCompteur Affectation créée
     * @throws ApiError
     */
    public static poserCompteur({
        identifiantCompteur,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantCompteur: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: CreerAffectationCompteur,
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/poser',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Déposer un compteur
     * Clôture l’affectation active avec l’index de dépose.
     * @returns AffectationCompteur Affectation clôturée
     * @throws ApiError
     */
    public static deposerCompteur({
        identifiantCompteur,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantCompteur: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            date_depose: string;
            index_depose: number;
            motif?: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/deposer',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Remplacer un compteur
     * Lie la dépose et la pose ; l’ordre temporel définitif reste documenté dans les arbitrages de données.
     * @returns AffectationCompteur Remplacement enregistré
     * @throws ApiError
     */
    public static remplacerCompteur({
        identifiantCompteur,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantCompteur: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            identifiant_nouveau_compteur: string;
            date_remplacement: string;
            index_depose: number;
            index_pose: number;
        },
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/remplacer',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Réformer un compteur
     * Retire définitivement le compteur du parc utilisable selon RM-CPT.
     * @returns Compteur Compteur réformé
     * @throws ApiError
     */
    public static reformerCompteur({
        identifiantCompteur,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantCompteur: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/reformer',
            path: {
                'identifiant_compteur': identifiantCompteur,
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
     * Rechercher des affectations de compteur
     * Recherche les périodes d’affectation par compteur ou Point.
     * @returns PageAffectationsCompteur Page d’affectations
     * @throws ApiError
     */
    public static rechercherAffectationsCompteur({
        identifiantCompteur,
        identifiantPointConsommation,
        dateDebut,
        dateFin,
    }: {
        identifiantCompteur?: string,
        identifiantPointConsommation?: string,
        dateDebut?: string,
        dateFin?: string,
    }): CancelablePromise<PageAffectationsCompteur> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/affectations-compteur',
            query: {
                'identifiant_compteur': identifiantCompteur,
                'identifiant_point_consommation': identifiantPointConsommation,
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
     * Créer une affectation de compteur
     * Prépare une affectation sans contourner le Service métier de pose.
     * @returns AffectationCompteur Affectation préparée
     * @throws ApiError
     */
    public static creerAffectationCompteur({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerAffectationCompteur,
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/affectations-compteur',
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
     * Consulter une affectation de compteur
     * Retourne une période d’affectation et ses index figés.
     * @returns AffectationCompteur Affectation trouvée
     * @throws ApiError
     */
    public static consulterAffectationCompteur({
        identifiantAffectation,
    }: {
        identifiantAffectation: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/affectations-compteur/{identifiant_affectation}',
            path: {
                'identifiant_affectation': identifiantAffectation,
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
     * Clôturer une affectation de compteur
     * Clôture la période sans suppression physique.
     * @returns AffectationCompteur Affectation clôturée
     * @throws ApiError
     */
    public static cloturerAffectationCompteur({
        identifiantAffectation,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantAffectation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/affectations-compteur/{identifiant_affectation}/cloturer',
            path: {
                'identifiant_affectation': identifiantAffectation,
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
     * Rechercher des relèves
     * Recherche paginée par compteur, Point, statut et période.
     * @returns PageReleves Page de relèves
     * @throws ApiError
     */
    public static rechercherReleves({
        identifiantCompteur,
        identifiantPointConsommation,
        statut,
        dateDebut,
        dateFin,
    }: {
        identifiantCompteur?: string,
        identifiantPointConsommation?: string,
        statut?: string,
        dateDebut?: string,
        dateFin?: string,
    }): CancelablePromise<PageReleves> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/releves',
            query: {
                'identifiant_compteur': identifiantCompteur,
                'identifiant_point_consommation': identifiantPointConsommation,
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
     * Enregistrer une relève
     * Enregistre une observation sans modifier une relève validée.
     * @returns Releve Relève enregistrée
     * @throws ApiError
     */
    public static enregistrerReleve({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerReleve,
        xCorrelationId?: string,
    }): CancelablePromise<Releve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/releves',
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
     * Importer un lot de relèves
     * Retourne un bilan ligne par ligne ; le seuil de traitement asynchrone est à arbitrer.
     * @returns BilanImportReleves Bilan d’import
     * @throws ApiError
     */
    public static importerReleves({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: {
            releves: Array<CreerReleve>;
        },
        xCorrelationId?: string,
    }): CancelablePromise<BilanImportReleves> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/releves/importer',
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
     * Consulter une relève
     * Retourne la mesure, son origine et son état de contrôle.
     * @returns Releve Relève trouvée
     * @throws ApiError
     */
    public static consulterReleve({
        identifiantReleve,
    }: {
        identifiantReleve: string,
    }): CancelablePromise<Releve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/releves/{identifiant_releve}',
            path: {
                'identifiant_releve': identifiantReleve,
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
     * Valider une relève
     * Valide la relève après contrôles automatiques ou manuels.
     * @returns Releve Relève validée
     * @throws ApiError
     */
    public static validerReleve({
        identifiantReleve,
        idempotencyKey,
        ifMatch,
        xCorrelationId,
    }: {
        identifiantReleve: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        xCorrelationId?: string,
    }): CancelablePromise<Releve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/releves/{identifiant_releve}/valider',
            path: {
                'identifiant_releve': identifiantReleve,
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
     * Rejeter une relève
     * Rejette la relève avec un motif explicite.
     * @returns Releve Relève rejetée
     * @throws ApiError
     */
    public static rejeterReleve({
        identifiantReleve,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantReleve: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: {
            motif: string;
        },
        xCorrelationId?: string,
    }): CancelablePromise<Releve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/releves/{identifiant_releve}/rejeter',
            path: {
                'identifiant_releve': identifiantReleve,
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
     * Corriger une relève
     * Crée une nouvelle relève liée à l’originale ; aucune réécriture silencieuse.
     * @returns Releve Relève de correction créée
     * @throws ApiError
     */
    public static corrigerReleve({
        identifiantReleve,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantReleve: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: CorrigerReleve,
        xCorrelationId?: string,
    }): CancelablePromise<Releve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/releves/{identifiant_releve}/corriger',
            path: {
                'identifiant_releve': identifiantReleve,
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
