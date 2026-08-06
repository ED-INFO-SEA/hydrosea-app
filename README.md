# HydroSEA — application

Ce dépôt porte le monolithe modulaire et l’application web HydroSEA. Le lot Mission 006 livre le premier parcours vertical Tiers et se raccorde au référentiel `hydrosea-platform` et au socle local `hydrosea-infra`. Il ne contient aucune infrastructure de production.

## Démarrage rapide

Prérequis : Java 21, Node.js 22, Docker et les services de `hydrosea-infra` démarrés.

1. Copier `.env.example` vers `.env` et renseigner uniquement des secrets locaux.
2. Exécuter `make installer` puis `make generer-api`.
3. Démarrer en processus locaux avec `make demarrer-backend` et `make demarrer-frontend`, ou dans Docker avec `make demarrer`.
4. Ouvrir `http://localhost:5173`.

Les commandes disponibles sont `make verifier`, `installer`, `generer-api`, `demarrer-backend`, `demarrer-frontend`, `demarrer`, `tester`, `tester-integration`, `formater`, `analyser`, `construire` et `nettoyer`.

## Contenu

- `backend` : Java 21, Spring Boot, Spring Modulith, JPA/JDBC, Flyway, OAuth2, RabbitMQ, MinIO et Micrometer ;
- `frontend` : TypeScript strict, React, Vite, Keycloak avec Authorization Code Flow et PKCE, client OpenAPI généré ;
- `api` : version du contrat et regroupement généré, jamais source métier autonome ;
- `docs` : architecture, développement, exploitation et arbitrages ;
- `compose.dev.yaml` : backend et frontend seulement, raccordés aux réseaux de `hydrosea-infra`.

## Parcours Tiers

Le backend implémente la création d’une personne physique ou morale, la consultation, la recherche paginée, la modification autorisée et l’archivage logique. La concurrence utilise ETag et `If-Match`; la création et l’archivage utilisent une clé d’idempotence persistée. Chaque changement écrit un événement et une entrée de boîte d’envoi dans la transaction métier.

Voir [Architecture applicative](docs/architecture/Architecture-applicative.md), [Installation](docs/developpement/Installation.md) et [Arbitrages](docs/arbitrages/Arbitrages-applicatifs.md).
