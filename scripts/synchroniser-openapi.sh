#!/bin/sh
set -eu
racine=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
usage() { echo 'Usage: synchroniser-openapi.sh CHEMIN_HYDROSEA_PLATFORM | --version REF_GIT' >&2; exit 2; }
[ "$#" -ge 1 ] || usage
destination="$racine/api/source"
temp=''
if [ "$1" = '--version' ]; then
  [ "$#" -eq 2 ] || usage
  temp=$(mktemp -d)
  trap 'rm -rf "$temp"' EXIT
  if [ -n "${GH_TOKEN:-}" ] && command -v gh >/dev/null 2>&1; then
    gh repo clone ED-INFO-SEA/hydrosea-platform "$temp/depot" -- --quiet --filter=blob:none --no-checkout
  else
    git clone --quiet --filter=blob:none --no-checkout https://github.com/ED-INFO-SEA/hydrosea-platform.git "$temp/depot"
  fi
  git -C "$temp/depot" sparse-checkout set api
  git -C "$temp/depot" checkout --quiet "$2"
  source_api="$temp/depot/api"
else
  [ "$#" -eq 1 ] || usage
  source_api=$(CDPATH='' cd -- "$1/api" && pwd) || usage
fi
[ -f "$source_api/openapi.yaml" ] || { echo 'Contrat api/openapi.yaml absent.' >&2; exit 3; }
rm -rf "$destination"
mkdir -p "$destination"
cp "$source_api/openapi.yaml" "$destination/openapi.yaml"
for repertoire in paths schemas examples security; do
  [ ! -d "$source_api/$repertoire" ] || cp -R "$source_api/$repertoire" "$destination/$repertoire"
done
echo "Contrat OpenAPI synchronisé depuis $source_api"
