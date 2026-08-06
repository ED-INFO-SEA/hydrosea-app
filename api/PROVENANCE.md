# Provenance du contrat OpenAPI

- dépôt source : `ED-INFO-SEA/hydrosea-platform` ;
- commit source : `307a7dd6a43e44bf7b2f52f8bc9fef3feb244a8b` ;
- fichier d’entrée : `api/openapi.yaml` et ses références sous `api/{paths,schemas,examples,security}` ;
- regroupement : Redocly CLI `2.44.1` ;
- génération du client : `openapi-typescript-codegen` `0.29.0` ;
- empreinte SHA-256 de `openapi.bundle.yaml` : `1302dcca3a0a8dd7ef486a4aafecb52714c655e7d02df68487009aa97ff8ed0b`.

`api/source` est un miroir minimal et non modifiable manuellement. Seuls le contrat principal et les répertoires nécessaires à la résolution de ses références sont copiés. Les scripts, tests et documents propres au référentiel source ne sont pas dupliqués dans l’application.

La synchronisation s’effectue avec `scripts/synchroniser-openapi.sh --version $(cat api/VERSION)`. La CI regroupe le contrat avec les versions épinglées dans `frontend/package-lock.json`, régénère le client TypeScript, vérifie l’empreinte et refuse toute divergence Git. Les fichiers sous `frontend/src/api/genere` sont générés et ne doivent jamais être modifiés à la main.
