# Contrats OpenAPI HydroSEA

`openapi.yaml` agrège les chemins, schémas, exemples et la sécurité du noyau. Le contrat expose les Services métier et ne constitue ni une implémentation ni une copie des tables SQL.

## Organisation

- `paths/` : opérations par domaine ;
- `schemas/` : ressources et composants communs ;
- `examples/` : charges réalistes et erreurs ;
- `security/` : OAuth2 et portées initiales ;
- `tests/` : contrôles statiques propres à HydroSEA.

## Validation

```bash
bash api/valider-openapi.sh
```

Le script utilise `@redocly/cli` 2.2.2, résout les références, valide OpenAPI et lance les contrôles de contrat. Voir les [conventions](../docs/09-API/Conventions-API.md), l’[ADR-013](../docs/00-Gouvernance/ADR/ADR-013-Strategie-API.md), les [arbitrages](../docs/09-API/Arbitrages-API.md) et le [dictionnaire](../docs/08-ModeleDonnees/Dictionnaire-de-Donnees-Noyau.md).

## Traçabilité

Chaque opération porte `x-hydrosea-bs`, `x-hydrosea-rm`, `x-hydrosea-evt` et `x-hydrosea-tables`. Le catalogue initial des erreurs stables est dans [codes-erreur.yaml](schemas/codes-erreur.yaml).
