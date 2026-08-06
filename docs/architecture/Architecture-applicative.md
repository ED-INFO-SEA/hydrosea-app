# Architecture applicative

HydroSEA est un monolithe modulaire. Les contrôleurs parlent aux Services applicatifs, qui orchestrent le domaine et des ports. Les adaptateurs techniques implémentent les ports.

```mermaid
flowchart LR
  Web["Application web React"] -->|"REST, OAuth2, JWT"| API["Interfaces API"]
  API --> APP["Services applicatifs"]
  APP --> DOM["Domaine"]
  APP --> PORTS["Ports"]
  PORTS --> PG["PostgreSQL"]
  PORTS --> MQ["RabbitMQ"]
  PORTS --> S3["MinIO"]
  KC["Keycloak"] --> Web
  KC --> API
```

Le domaine ne connaît aucun cadre technique. Une transaction Tiers modifie `ref`, écrit `evt.evenement_metier` et `evt.boite_envoi`. Le publieur différé est le seul composant qui contacte RabbitMQ. Le stockage documentaire est accessible par `PortStockageDocuments`, jamais par un module métier directement.

Le contrat OpenAPI fusionné dans `hydrosea-platform` au commit consigné dans `api/VERSION` est la source de vérité. `scripts/synchroniser-openapi.sh` accepte un chemin local ou une référence Git explicite et produit le miroir versionné `api/source`; celui-ci n’est jamais modifié à la main. Redocly produit `api/openapi.bundle.yaml`, puis le générateur produit le client TypeScript. La CI refuse toute différence entre le miroir épinglé, le regroupement et le client. Une rupture du contrat exige une mise à jour coordonnée et, si elle est incompatible, une nouvelle version d’API.

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant W as Web
  participant K as Keycloak
  participant A as API HydroSEA
  U->>W: Se connecter
  W->>K: Authorization Code + PKCE
  K-->>W: Code puis jetons
  W->>A: Requête avec JWT
  A->>K: Validation de signature, issuer, audience et portées
  A-->>W: Réponse corrélée
```
