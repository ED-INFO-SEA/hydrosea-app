# Chaîne d’approvisionnement

Versions structurantes : Java 21, Maven Wrapper 3.3.4, Maven 3.9.11, Spring Boot 3.5.4, Node.js 22.18.0, npm avec `package-lock.json`, TypeScript 5.9.2, Redocly CLI 2.44.1 et `openapi-typescript-codegen` 0.29.0. Les images des Dockerfiles et Testcontainers portent une version précise. Les actions GitHub utilisent un SHA complet.

`pom.xml` et `package-lock.json` verrouillent les dépendances. Le client API est régénéré et comparé en CI. Une mise à jour dépendante est isolée, relit les notes de publication et exécute contrats, migrations, architecture, intégration et parcours web.

Le contrôle `npm audit` signale actuellement des dépendances transitives du générateur OpenAPI ; elles ne sont pas embarquées dans le paquet frontend de production. Leur remplacement est prioritaire avant toute mise en production. La future chaîne ajoutera OWASP Dependency-Check ou équivalent, un scan des images, une SBOM CycloneDX, la vérification des licences et des attestations. Une vulnérabilité critique embarquée bloquera la construction ; une vulnérabilité d’outil exigera une dérogation datée et une échéance.

La provenance OpenAPI est verrouillée dans [`api/PROVENANCE.md`](../../api/PROVENANCE.md) par dépôt, commit source, versions des générateurs et empreinte SHA-256 du regroupement. Le miroir exclut les scripts, tests et documents qui ne participent pas à la résolution du contrat. `api/source`, `api/openapi.bundle.yaml` et `frontend/src/api/genere` ne sont pas modifiables manuellement.
