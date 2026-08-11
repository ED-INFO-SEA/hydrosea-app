# HydroSEA — application

Ce dépôt porte le monolithe modulaire et l’application web HydroSEA. La Preview 0.1 livre un premier dossier usager démontrable, raccordé à `hydrosea-platform` et au socle local `hydrosea-infra`. Il ne contient aucune infrastructure de production.

## Lancer HydroSEA Preview 0.1

### Windows 11 avec Docker Desktop

Prérequis : Docker Desktop démarré et les dépôts `hydrosea-app` et `hydrosea-infra` placés côte à côte. Aucun GNU Make, Java ou Node.js local n’est requis :

```powershell
.\scripts\demo.ps1
```

Le lanceur crée au besoin les configurations `.env` locales avec des secrets aléatoires non destinés à la production, démarre l’infrastructure, prépare Keycloak puis attend l’application. Si `hydrosea-infra` se trouve ailleurs :

```powershell
.\scripts\demo.ps1 -InfraPath "C:\chemin\vers\hydrosea-infra"
```

Pour arrêter les services sans supprimer les volumes : `.\scripts\demo.ps1 -Stop`. Pour restaurer uniquement les données fictives : `.\scripts\demo.ps1 -Reset`.

### Git Bash, Linux et macOS

Prérequis : Docker, Docker Compose, GNU Make et `hydrosea-infra` placé à côté du dépôt. Puis :

```sh
make demo
```

L’interface est disponible sur `http://localhost:5173`. Les comptes locaux sont préparés par Keycloak ; leurs mots de passe aléatoires restent uniquement dans le fichier `.env` ignoré par Git. La Preview couvre Tiers, Points, Contrats jusqu’à Actif, Compteurs jusqu’à la pose, Synthèse et activité. Relèves, Facturation, Paiements et opérations terminales restent volontairement absents. Pour rétablir le jeu fictif : `make demo-reset`.

La CI vérifie la syntaxe et les fonctions autonomes du lanceur sur Windows. GitHub Actions ne fournit pas de moteur Docker Desktop exécutant des conteneurs Linux sur son runner Windows ; le parcours Docker complet reste donc couvert par le scénario Linux `preview-e2e` et par l’essai local Windows 11 avec Docker Desktop.

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
