/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageEvenementsMetier } from '../models/PageEvenementsMetier';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditService {
    /**
     * Rechercher des événements métier
     * Lecture contrôlée et minimisée ; aucune charge complète ni opération d’écriture n’est exposée.
     * @returns PageEvenementsMetier Page d’événements minimisés
     * @throws ApiError
     */
    public static rechercherEvenementsMetier({
        page,
        taillePage,
        typeEvenement,
        identifiantAgregat,
        dateDebut,
        dateFin,
    }: {
        page?: number,
        taillePage?: number,
        typeEvenement?: string,
        identifiantAgregat?: string,
        dateDebut?: string,
        dateFin?: string,
    }): CancelablePromise<PageEvenementsMetier> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/evenements-metier',
            query: {
                'page': page,
                'taille_page': taillePage,
                'type_evenement': typeEvenement,
                'identifiant_agregat': identifiantAgregat,
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
            errors: {
                400: `Requête invalide.`,
                401: `Authentification requise.`,
                403: `Droit insuffisant.`,
                500: `Erreur interne sans information sensible.`,
            },
        });
    }
}
