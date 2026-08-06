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

Flyway exécute les migrations avec `hydrosea_migration`. `V002` n’accorde à `hydrosea_app` que DML et usage de séquence. Une correction après publication utilise une nouvelle migration ; `repair` n’est admis qu’après constat documenté d’un échec technique sans modification d’une migration appliquée.

