# Opérations de HydroSEA Preview 0.1

Ce registre décrit la disponibilité applicative, indépendamment du statut prospectif conservé dans le référentiel OpenAPI.

| operationId | Module | Implémentée | Écran | Test API | Test frontend | Limite connue |
|---|---|---:|---|---|---|---|
| rechercher_tiers, creer_tiers, consulter_tiers, modifier_tiers, archiver_tiers | Tiers | oui | Tiers | ParcoursTiersIT | App.test | fusion exclue |
| rechercher_points_desserte, creer_point_desserte, consulter_point_desserte, rendre_disponible_point_desserte | Points | oui | Points | ParcoursPreviewIT | Preview.test | SIG non synchronisé |
| rechercher_points_consommation, creer_point_consommation, consulter_point_consommation, modifier_point_consommation, ouvrir_point_consommation, rattacher_point_consommation_desserte | Points | oui | Points | ParcoursPreviewIT | Preview.test | fermeture exclue |
| rechercher_contrats_abonnement, creer_contrat_abonnement, consulter_contrat_abonnement, modifier_contrat_abonnement, ajouter_participant_contrat, valider_contrat_abonnement, activer_contrat_abonnement | Contrats | oui | Contrats | ParcoursPreviewIT | Preview.test | résiliation exclue |
| rechercher_compteurs, enregistrer_compteur, consulter_compteur, modifier_compteur, poser_compteur, rechercher_affectations_compteur, consulter_affectation_compteur | Comptage | oui | Compteurs | ParcoursPreviewIT | Preview.test | dépose et Relèves exclues |

Le contrôle statique compare cette liste aux routes `ControleurPreview` et refuse qu’une opération hors périmètre soit présentée comme disponible.
