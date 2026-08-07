#!/bin/sh
set -eu
[ "${HYDROSEA_ENV:-local}" != production ] || { echo 'Interdit en production.' >&2; exit 3; }
: "${POSTGRES_DEMO_URL:=postgresql://hydrosea_app@localhost:5432/hydrosea}"
echo 'Chargement déterministe de données fictives Preview.'
psql "$POSTGRES_DEMO_URL" -v ON_ERROR_STOP=1 -f demo/donnees/preview.sql
