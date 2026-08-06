# Stratégie de tests

Les tests unitaires couvrent invariants du domaine, Services applicatifs et erreurs. ArchUnit contrôle les dépendances. Les tests web contrôlent portées, statuts, ETag, idempotence et `ErreurApi`. Le profil Maven `integration` utilise Testcontainers avec PostgreSQL/PostGIS, RabbitMQ et MinIO ; il rejoue Flyway sur une base vide et exerce concurrence, persistance, boîte d’envoi et stockage.

Les contrôles Testcontainers lancent deux appels concurrents sur une même portée idempotente et prouvent une seule exécution. Ils couvrent aussi l’isolation par URI et sujet JWT, le rejeu exact après évolution de la ressource, l’archivage avec l’ancien `If-Match`, l’immuabilité SQL de `tiers_id`, le SIRET exact bloquant et la raison sociale homonyme sans SIRET non bloquante. La validation du PATCH refuse un corps vide ou deux spécialisations.

Vitest et Testing Library couvrent composants, formulaires, erreurs et conflit de version. `axe-core` contrôle l’accessibilité du parcours principal. Un parcours de bout en bout minimal sera renforcé lorsque le domaine Keycloak d’intégration sera stabilisé.

La cible initiale de couverture est 70 % des classes de domaine et Services réellement implémentés. Elle guide les lacunes sans devenir un objectif artificiel. Les adaptateurs générés et les simples configurations sont exclus du jugement métier.
