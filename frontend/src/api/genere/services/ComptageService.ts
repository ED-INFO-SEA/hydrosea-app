/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffectationCompteur } from '../models/AffectationCompteur';
import type { BilanImportReleves } from '../models/BilanImportReleves';
import type { Compteur } from '../models/Compteur';
import type { CorrigerAffectationCompteur } from '../models/CorrigerAffectationCompteur';
import type { CorrigerReleve } from '../models/CorrigerReleve';
import type { CreerCompteur } from '../models/CreerCompteur';
import type { CreerReleve } from '../models/CreerReleve';
import type { DeposerCompteur } from '../models/DeposerCompteur';
import type { MettreCompteurControle } from '../models/MettreCompteurControle';
import type { ModifierCompteur } from '../models/ModifierCompteur';
import type { PageAffectationsCompteur } from '../models/PageAffectationsCompteur';
import type { PageCompteurs } from '../models/PageCompteurs';
import type { PageReleves } from '../models/PageReleves';
import type { PoserCompteur } from '../models/PoserCompteur';
import type { ReformerCompteur } from '../models/ReformerCompteur';
import type { Releve } from '../models/Releve';
import type { RemettreCompteurDisponible } from '../models/RemettreCompteurDisponible';
import type { RemplacerCompteur } from '../models/RemplacerCompteur';
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
     * Pose atomiquement un Compteur disponible sur un Point de consommation, crée la période d’Affectation et conserve l’index de pose. Cette opération prospective ne crée ni n’active aucun Contrat et ne modifie aucune géométrie SIG.
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
        requestBody: PoserCompteur,
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
     * Clôt atomiquement l’Affectation active avec l’index de dépose ou une justification qualifiée et place le Compteur dans son état de devenir. Cette opération prospective ne ferme pas le Point, ne résilie aucun Contrat et ne supprime aucune Relève.
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
        requestBody: DeposerCompteur,
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
     * Remplace atomiquement le Compteur sortant par un Compteur entrant disponible au même instant T, clôt l’ancienne Affectation et crée la nouvelle avec leurs index. Cette opération prospective ne modifie ni Contrat, ni titulaire, ni dette, ni Point de desserte.
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
        requestBody: RemplacerCompteur,
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
     * Réforme définitivement un Compteur déposé et sans Affectation active, tout en conservant son identité, ses Affectations et ses Relèves historiques. Cette opération prospective ne supprime aucune donnée.
     * @returns Compteur Compteur réformé
     * @throws ApiError
     */
    public static reformerCompteur({
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
        requestBody: ReformerCompteur,
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
     * Mettre un Compteur en contrôle
     * Place un Compteur disponible ou déposé en contrôle métrologique après vérification de l’absence d’Affectation active. Cette opération prospective ne crée aucune Affectation et ne modifie ni Point ni Contrat.
     * @returns Compteur Compteur en contrôle
     * @throws ApiError
     */
    public static mettreCompteurControle({
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
        requestBody: MettreCompteurControle,
        xCorrelationId?: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/mettre-en-controle',
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
     * Remettre un Compteur disponible
     * Clôt un contrôle favorable et rend disponible un Compteur sans Affectation active, en conservant le résultat et sa référence. Cette opération prospective ne pose pas le Compteur.
     * @returns Compteur Compteur disponible
     * @throws ApiError
     */
    public static remettreCompteurDisponible({
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
        requestBody: RemettreCompteurDisponible,
        xCorrelationId?: string,
    }): CancelablePromise<Compteur> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/compteurs/{identifiant_compteur}/remettre-disponible',
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
     * Corriger une Affectation de compteur
     * Crée une rectification historisée d’une borne, d’un index, d’une qualité ou d’une référence d’intervention sans écraser les valeurs d’origine. Cette opération administrative prospective ne pose, ne dépose et ne remplace aucun Compteur.
     * @returns AffectationCompteur Rectification enregistrée
     * @throws ApiError
     */
    public static corrigerAffectationCompteur({
        identifiantAffectation,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantAffectation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: CorrigerAffectationCompteur,
        xCorrelationId?: string,
    }): CancelablePromise<AffectationCompteur> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/affectations-compteur/{identifiant_affectation}',
            path: {
                'identifiant_affectation': identifiantAffectation,
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
