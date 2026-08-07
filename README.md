# HydroSEA — application

Ce dépôt porte le monolithe modulaire et l’application web HydroSEA. La Preview 0.1 livre un premier dossier usager démontrable, raccordé à `hydrosea-platform` et au socle local `hydrosea-infra`. Il ne contient aucune infrastructure de production.

## Lancer HydroSEA Preview 0.1

Prérequis : Java 21, Node.js 22, Docker, GNU Make et `hydrosea-infra` démarré. Puis :

```sh
make demo
```

L’interface est disponible sur `http://localhost:5173`. Les comptes locaux sont préparés par Keycloak à partir des variables `DEMO_*_PASSWORD` ; aucun secret réel n’est versionné. La Preview couvre Tiers, Points, Contrats jusqu’à Actif, Compteurs jusqu’à la pose, Synthèse et activité. Relèves, Facturation, Paiements et opérations terminales restent volontairement absents. Pour rétablir le jeu fictif : `make demo-reset`.

## Démarrage rapide

Prérequis : Java 21, Node.js 22, Docker et les services de `hydrosea-infra` démarrés.

1. Copier `.env.example` vers `.env` et renseigner uniquement des secrets locaux.
2. Exécuter `make installer` puis `make generer-api`.
3. Démarrer en processus locaux avec `make demarrer-backend` et `make demarrer-frontend`, ou dans Docker avec `make demarrer`.
4. Ouvrir `http://localhost:5173`.

Les commandes disponibles sont `make demo`, `demo-reset`, `verifier`, `installer`, `generer-api`, `tester`, `tester-integration`, `formater`, `analyser`, `construire` et `nettoyer`.

## Contenu

- `backend` : Java 21, Spring Boot, Spring Modulith, JPA/JDBC, Flyway, OAuth2, RabbitMQ, MinIO et Micrometer ;
- `frontend` : TypeScript strict, React, Vite, Keycloak avec Authorization Code Flow et PKCE, client OpenAPI généré ;
- `api` : version du contrat et regroupement généré, jamais source métier autonome ;
- `docs` : architecture, développement, exploitation et arbitrages ;
- `compose.dev.yaml` : backend et frontend seulement, raccordés aux réseaux de `hydrosea-infra`.

## Parcours Tiers

Le backend implémente la création d’une personne physique ou morale, la consultation, la recherche paginée, la modification autorisée et l’archivage logique. La concurrence utilise ETag et `If-Match`; la création et l’archivage utilisent une clé d’idempotence persistée. Chaque changement écrit un événement et une entrée de boîte d’envoi dans la transaction métier.

Voir [Architecture applicative](docs/architecture/Architecture-applicative.md), [Installation](docs/developpement/Installation.md) et [Arbitrages](docs/arbitrages/Arbitrages-applicatifs.md).
