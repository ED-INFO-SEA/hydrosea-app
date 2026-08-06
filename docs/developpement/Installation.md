# Installation de développement

## Prérequis

Java 21, Git, Docker, Node.js 22 et `make`. Cloner `hydrosea-platform`, `hydrosea-infra` et `hydrosea-app` côte à côte. Démarrer d’abord l’infrastructure selon sa documentation et créer `.env` à partir de `.env.example`.

En processus locaux : `make installer`, `make generer-api`, puis `make demarrer-backend` et `make demarrer-frontend`. Dans Docker : `make demarrer`. Le second mode construit seulement le backend et le frontend et rejoint les réseaux externes de `hydrosea-infra`.

Le backend répond sur `http://localhost:8080`, le frontend sur `http://localhost:5173`, la santé sur `/actuator/health` et les métriques sur `/actuator/prometheus` avec authentification pour ces dernières.

Pour actualiser le contrat depuis un dépôt local : `sh scripts/synchroniser-openapi.sh /chemin/hydrosea-platform`. Pour la version épinglée : `make generer-api`. Une différence générée doit être relue et commitée avec le changement de `api/VERSION`.

