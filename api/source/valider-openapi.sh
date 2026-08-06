#!/usr/bin/env bash
set -euo pipefail

racine="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
sortie="$racine/.validation-openapi-resolue.json"
racine_outil="$racine"
sortie_outil="$sortie"
if [[ -n "${WSL_DISTRO_NAME:-}" ]] && command -v wslpath >/dev/null 2>&1; then
  racine_outil="$(wslpath -w "$racine")"
  sortie_outil="$(wslpath -w "$sortie")"
fi
trap 'rm -f "$sortie"' EXIT

npx --yes @redocly/cli@2.2.2 lint "$racine_outil/openapi.yaml"
npx --yes @redocly/cli@2.2.2 bundle "$racine_outil/openapi.yaml" --output "$sortie_outil"
commande_node=node
if ! command -v node >/dev/null 2>&1 && command -v node.exe >/dev/null 2>&1; then commande_node=node.exe; fi
"$commande_node" "$racine_outil/tests/controle-contrat.mjs" "$sortie_outil"
