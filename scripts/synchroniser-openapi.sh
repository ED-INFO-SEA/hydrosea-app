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
  git clone --quiet --filter=blob:none --no-checkout https://github.com/ED-INFO-SEA/hydrosea-platform.git "$temp/depot"
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
cp -R "$source_api"/. "$destination"/
echo "Contrat OpenAPI synchronisé depuis $source_api"

