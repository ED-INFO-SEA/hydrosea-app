# ADR-APP-001 — Socle technique

- Statut : Accepté pour le socle
- Date : 2026-08-06

## Contexte

HydroSEA doit démarrer comme une application web modulaire, conforme aux contrats et exploitable avec l’infrastructure locale déjà publiée.

## Décision

Le backend utilise Java 21 LTS, Spring Boot 3.5.4, Spring Modulith 1.4.1, Maven 3.9.11, Flyway et PostgreSQL. JPA est retenu pour les transactions et le cycle de vie applicatif, mais le parcours Tiers utilise un adaptateur JDBC explicite afin de maîtriser les schémas publiés et d’empêcher la navigation implicite entre agrégats. Les types du domaine ne dépendent ni de Spring ni de JPA.

Le frontend séparé utilise TypeScript 5.9 en mode strict, React 19, Vite 7 et Keycloak. Le client `fetch` est généré par `openapi-typescript-codegen` 0.29 après regroupement par Redocly CLI 2.44.1.

## Alternatives

- Spring Data JDBC : plus direct, mais moins adapté aux extensions futures et sans gain immédiat face à l’adaptateur JDBC maîtrisé.
- Microservices : rejetés ; ils multiplieraient les transactions distribuées avant stabilisation des frontières.
- Client API manuel : rejeté car il dériverait du contrat de référence.

## Conséquences et risques

Le monolithe reste simple à déployer et testable par module. Le mélange JPA/JDBC impose des conventions explicites. Spring Boot et Node.js doivent suivre une montée de version trimestrielle, précédée des notes de publication, tests contractuels et tests d’intégration. Les versions majeures font l’objet d’une ADR et d’un essai sur branche dédiée.

