# Correspondance avec le modèle de données

La migration `V001` reprend uniquement le sous-ensemble nécessaire à BO-001 et à ses garanties techniques ; elle ne recopie pas l’ensemble du modèle logique.

| Modèle de référence | Migration applicative | Usage |
|---|---|---|
| `ref.tiers` | `ref.tiers` | identité, référence, catégorie, statut, version, archivage |
| `ref.tiers_personne_physique` | identique | spécialisation physique |
| `ref.tiers_personne_morale` | identique | spécialisation morale |
| `evt.evenement_metier` | identique, sous-ensemble de contraintes | événement immuable à publier |
| `evt.boite_envoi` | identique, statut `ERREUR` ajouté | publication transactionnelle et reprises |
| absent | `app.idempotence` | mémorisation technique des commandes HTTP |

Écarts justifiés : une séquence produit la référence `TIE-`; une contrainte différée garantit exactement une spécialisation ; `app.idempotence` est une table applicative hors noyau métier ; le statut `ERREUR` rend les échecs opérables. Ces écarts ne modifient aucun identifiant documentaire. Ils devront être proposés au référentiel si leur portée devient transverse.

`V003` applique les corrections de la revue d’architecture sans modifier les migrations publiées. Elle interdit tout changement de `tiers_id` dans les spécialisations. Elle harmonise les instants techniques en `date_enregistrement_technique`, `date_disponibilite`, `date_publication` et `date_expiration` : le préfixe `date_` désigne systématiquement un instant, tandis que le suffixe qualifie son rôle.

L’unicité d’idempotence porte sur `identifiant_client + operation + uri + cle`. Le cycle `EN_COURS → TERMINE` conserve la réponse HTTP complète ; `ECHEC` rend une nouvelle tentative déterministe. Les enregistrements expirés sont remplaçables. Un verrou transactionnel PostgreSQL sérialise une portée avant toute commande métier.

Flyway exécute les migrations avec `hydrosea_migration`. `V002` n’accorde à `hydrosea_app` que DML et usage de séquence. Une correction après publication utilise une nouvelle migration ; `repair` n’est admis qu’après constat documenté d’un échec technique sans modification d’une migration appliquée.
