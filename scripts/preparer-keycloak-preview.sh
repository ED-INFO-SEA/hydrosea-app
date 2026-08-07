#!/bin/sh
set -eu
[ "${HYDROSEA_ENV:-local}" != production ] || { echo 'Interdit en production.' >&2; exit 3; }
: "${KEYCLOAK_ADMIN_URL:=http://localhost:8081}"
: "${KEYCLOAK_ADMIN_USER:=admin}"
: "${KEYCLOAK_ADMIN_PASSWORD:?Mot de passe local Keycloak requis}"
echo "Préparation idempotente de Keycloak Preview sur $KEYCLOAK_ADMIN_URL"
docker exec hydrosea-keycloak /opt/keycloak/bin/kcadm.sh config credentials --server "$KEYCLOAK_ADMIN_URL" --realm master --user "$KEYCLOAK_ADMIN_USER" --password "$KEYCLOAK_ADMIN_PASSWORD"
for role in tiers:lecture tiers:ecriture points:lecture points:ecriture contrats:lecture contrats:ecriture comptage:lecture comptage:ecriture; do
 docker exec hydrosea-keycloak /opt/keycloak/bin/kcadm.sh create "realms/hydrosea/roles" -s "name=$role" 2>/dev/null || true
done
echo 'Rôles Preview présents. Les mots de passe utilisateurs proviennent des variables DEMO_*_PASSWORD.'
