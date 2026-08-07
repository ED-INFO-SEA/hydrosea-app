# Correspondance du modèle de données Preview 0.1

| Cible canonique | Implémentation Preview | Justification | Dette à résorber |
|---|---|---|---|
| `des.point_desserte` | identité, état, commune, adresse, version et métadonnées | périmètre administratif sans géométrie patrimoniale | ajouter les projections SIG lors de la mission dédiée |
| `des.point_consommation` | identité, état, usage, adresse, version et métadonnées | opérations nécessaires au parcours | compléter après arbitrages |
| `des.liaison_desserte_consommation` | période `[début, fin)`, exclusion des chevauchements, audit | garantit l’historique | aucune divergence fonctionnelle connue |
| `abo.contrat_abonnement` | liaison directe au Point, états Preview, dates et audit | les transitions terminales sont exclues | introduire la liaison canonique lors du périmètre mutation |
| `abo.participation_contrat` | période, rôles principal/solidaire et responsabilité | couvre les rôles Preview | compléter les rôles futurs sans modifier Tiers |
| historique du Contrat | `abo.historique_etat_contrat` avec une ligne courante | transitions consultables hors événements | aligner le nom définitif lors de la mission modèle complet |
| `cpt.compteur` | numéro fabricant, état, caractéristiques et audit | identité nécessaire à la pose | compléter la métrologie ultérieurement |
| `cpt.affectation_compteur` | période, index, intervention et exclusion | aucune Relève BO-007 créée | ajouter qualité d’index et rectification ultérieurement |

Les agrégats portent `date_creation`, `date_modification`, `cree_par`, `modifie_par` et `version`. Les tables temporelles portent leur période canonique. Aucune suppression physique n’est exposée.
