#!/bin/sh
set -eu
if grep -RInE '(^|[[:space:]])(password|secret|token)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9+/]{20,}' --exclude='.env.example' --exclude='package-lock.json' .; then
  echo 'Secret probable détecté.' >&2; exit 1
fi
if grep -RInE 'FROM[[:space:]]+[^[:space:]]*:latest|image:[[:space:]]*[^[:space:]]*:latest' --include='Dockerfile' --include='*.yaml' .; then
  echo 'Dépendance latest interdite.' >&2; exit 1
fi
if grep -E '^ *- uses:' .github/workflows/validation-applicative.yml | grep -Ev '@[0-9a-f]{40}([[:space:]]|$)'; then
  echo 'Action GitHub non épinglée.' >&2; exit 1
fi
if grep -RInE 'log\.(info|warn|error|debug).*?(dateNaissance|motDePasse|token|secret|coordonnees)' backend/src/main/java; then
  echo 'Donnée sensible envoyée aux journaux.' >&2; exit 1
fi
test -f backend/.mvn/wrapper/maven-wrapper.jar
test -f frontend/package-lock.json
test -f api/openapi.bundle.yaml
echo 'Contrôles statiques conformes.'

