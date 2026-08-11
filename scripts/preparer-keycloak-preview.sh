#!/bin/sh
set -eu

[ "${HYDROSEA_ENV:-local}" != production ] || { echo 'Interdit en production.' >&2; exit 3; }

application=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
infrastructure=${1:-${HYDROSEA_INFRA_PATH:-"$application/../hydrosea-infra"}}
env_file="$infrastructure/.env"
[ -f "$infrastructure/compose.yaml" ] || { echo "Dépôt hydrosea-infra introuvable : $infrastructure" >&2; exit 2; }
[ -f "$env_file" ] || { echo "Configuration hydrosea-infra/.env absente : $env_file" >&2; exit 2; }

set -a
# shellcheck disable=SC1090
. "$env_file"
set +a
: "${KEYCLOAK_ADMIN:?Variable KEYCLOAK_ADMIN absente}"
: "${KEYCLOAK_ADMIN_PASSWORD:?Variable KEYCLOAK_ADMIN_PASSWORD absente}"

compose() {
  (cd "$infrastructure" && docker compose --env-file .env "$@")
}
kcadm() {
  compose exec -T keycloak /opt/keycloak/bin/kcadm.sh "$@"
}

echo 'Préparation idempotente de Keycloak Preview'
kcadm config credentials --server http://localhost:8080 --realm master \
  --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD"
for role in tiers:lecture tiers:ecriture points:lecture points:ecriture contrats:lecture contrats:ecriture comptage:lecture comptage:ecriture; do
  kcadm get "realms/hydrosea/roles/$role" >/dev/null 2>&1 || \
    kcadm create realms/hydrosea/roles -s "name=$role" >/dev/null
done
echo 'Rôles Preview présents.'
