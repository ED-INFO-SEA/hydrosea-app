/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiverContrat } from '../models/ActiverContrat';
import type { AnnulerContrat } from '../models/AnnulerContrat';
import type { CloturerParticipationContrat } from '../models/CloturerParticipationContrat';
import type { ContratAbonnement } from '../models/ContratAbonnement';
import type { CreerContratAbonnement } from '../models/CreerContratAbonnement';
import type { CreerParticipationContrat } from '../models/CreerParticipationContrat';
import type { ModifierContratAbonnement } from '../models/ModifierContratAbonnement';
import type { ModifierParticipationContrat } from '../models/ModifierParticipationContrat';
import type { MuterContrat } from '../models/MuterContrat';
import type { PageContratsAbonnement } from '../models/PageContratsAbonnement';
import type { ParticipationContrat } from '../models/ParticipationContrat';
import type { ReactiverContrat } from '../models/ReactiverContrat';
import type { ResilierContrat } from '../models/ResilierContrat';
import type { SuspendreContrat } from '../models/SuspendreContrat';
import type { ValiderContrat } from '../models/ValiderContrat';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContratsService {
    /**
     * Rechercher des contrats d’abonnement
     * Recherche paginée par référence, statut, Tiers ou Point de consommation.
     * @returns PageContratsAbonnement Page de contrats
     * @throws ApiError
     */
    public static rechercherContratsAbonnement({
        page = 1,
        taillePage = 20,
        tri = 'date_creation',
        direction = 'desc',
        statut,
        reference,
        identifiantTiers,
        identifiantPointConsommation,
    }: {
        page?: number,
        taillePage?: number,
        tri?: 'date_creation' | 'reference' | 'statut' | 'date_effet',
        direction?: 'asc' | 'desc',
        statut?: string,
        reference?: string,
        identifiantTiers?: string,
        identifiantPointConsommation?: string,
    }): CancelablePromise<PageContratsAbonnement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/contrats-abonnement',
            query: {
                'page': page,
                'taille_page': taillePage,
                'tri': tri,
                'direction': direction,
                'statut': statut,
                'reference': reference,
                'identifiant_tiers': identifiantTiers,
                'identifiant_point_consommation': identifiantPointConsommation,
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
     * Créer un contrat d’abonnement
     * Crée un brouillon relié à un Point de consommation et à ses participants initiaux.
     * @returns ContratAbonnement Brouillon créé
     * @throws ApiError
     */
    public static creerContratAbonnement({
        idempotencyKey,
        requestBody,
        xCorrelationId,
    }: {
        idempotencyKey: string,
        requestBody: CreerContratAbonnement,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement',
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
     * Consulter un contrat d’abonnement
     * Retourne le contrat, son Point de consommation et ses participants autorisés.
     * @returns ContratAbonnement Contrat trouvé
     * @throws ApiError
     */
    public static consulterContratAbonnement({
        identifiantContrat,
    }: {
        identifiantContrat: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/contrats-abonnement/{identifiant_contrat}',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Modifier un contrat d’abonnement
     * Modifie les données autorisées avant ou pendant le cycle du contrat, sans commander une transition.
     * @returns ContratAbonnement Contrat modifié
     * @throws ApiError
     */
    public static modifierContratAbonnement({
        identifiantContrat,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ModifierContratAbonnement,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/contrats-abonnement/{identifiant_contrat}',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Valider un contrat d’abonnement
     * Vérifie les préconditions métier avant activation ; les contrôles restent définis par RM-CTR.
     * @returns ContratAbonnement Contrat validé
     * @throws ApiError
     */
    public static validerContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ValiderContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/valider',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Activer un contrat d’abonnement
     * Active un contrat validé à sa date d’effet avec un titulaire principal.
     * @returns ContratAbonnement Contrat actif
     * @throws ApiError
     */
    public static activerContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ActiverContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/activer',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Suspendre un contrat d’abonnement
     * Suspend le contrat selon le motif et la date d’effet fournis.
     * @returns ContratAbonnement Contrat suspendu
     * @throws ApiError
     */
    public static suspendreContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: SuspendreContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/suspendre',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Réactiver un contrat d’abonnement
     * Réactive un contrat suspendu lorsque la transition est autorisée.
     * @returns ContratAbonnement Contrat réactivé
     * @throws ApiError
     */
    public static reactiverContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ReactiverContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/reactiver',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Annuler un contrat d’abonnement
     * Annule un contrat qui n’est jamais entré en vigueur ; cette commande de cycle justifie une opération autonome pour porter décision, motif, concurrence et idempotence.
     * @returns ContratAbonnement Contrat annulé
     * @throws ApiError
     */
    public static annulerContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: AnnulerContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/annuler',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Résilier un contrat d’abonnement
     * Enregistre la date et le motif de résiliation sans supprimer l’historique.
     * @returns ContratAbonnement Contrat résilié
     * @throws ApiError
     */
    public static resilierContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ResilierContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/resilier',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Muter un contrat d’abonnement
     * Clôture le contrat sortant et prépare le contrat entrant ; les règles de reprise sont définies par BS-CTR-004.
     * @returns ContratAbonnement Contrat entrant créé
     * @throws ApiError
     */
    public static muterContratAbonnement({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: MuterContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ContratAbonnement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/muter',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Ajouter un participant au contrat
     * Ajoute un rôle contractuel historisé.
     * @returns ParticipationContrat Participant ajouté
     * @throws ApiError
     */
    public static ajouterParticipantContrat({
        identifiantContrat,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: CreerParticipationContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ParticipationContrat> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/participants',
            path: {
                'identifiant_contrat': identifiantContrat,
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
     * Modifier un participant au contrat
     * Modifie les attributs autorisés d’une participation selon sa version.
     * @returns ParticipationContrat Participation modifiée
     * @throws ApiError
     */
    public static modifierParticipantContrat({
        identifiantContrat,
        identifiantParticipation,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        identifiantParticipation: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: ModifierParticipationContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ParticipationContrat> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/participants/{identifiant_participation}',
            path: {
                'identifiant_contrat': identifiantContrat,
                'identifiant_participation': identifiantParticipation,
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
     * Clôturer une participation au contrat
     * Clôture le rôle sans supprimer sa période historique.
     * @returns ParticipationContrat Participation clôturée
     * @throws ApiError
     */
    public static cloturerParticipantContrat({
        identifiantContrat,
        identifiantParticipation,
        idempotencyKey,
        ifMatch,
        requestBody,
        xCorrelationId,
    }: {
        identifiantContrat: string,
        identifiantParticipation: string,
        idempotencyKey: string,
        /**
         * Version attendue de la ressource.
         */
        ifMatch: string,
        requestBody: CloturerParticipationContrat,
        xCorrelationId?: string,
    }): CancelablePromise<ParticipationContrat> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/contrats-abonnement/{identifiant_contrat}/participants/{identifiant_participation}/cloturer',
            path: {
                'identifiant_contrat': identifiantContrat,
                'identifiant_participation': identifiantParticipation,
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
