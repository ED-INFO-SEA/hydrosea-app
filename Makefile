SHELL := /bin/sh
.PHONY: verifier installer generer-api demarrer-backend demarrer-frontend demarrer demo demo-reset tester tester-integration formater analyser construire nettoyer
verifier: analyser tester construire
installer:
	cd frontend && npm ci
	cd backend && ./mvnw -B dependency:go-offline
generer-api:
	./scripts/synchroniser-openapi.sh --version "$$(cat api/VERSION)"
	cd frontend && npm run generate:api
demarrer-backend:
	cd backend && ./mvnw spring-boot:run
demarrer-frontend:
	cd frontend && npm run dev
demarrer:
	docker compose -f compose.dev.yaml up --build
demo:
	@echo "HydroSEA Preview 0.1 — vérification des prérequis"
	@docker version >/dev/null || (echo "Docker est requis." && exit 2)
	@docker network inspect hydrosea_base_donnees >/dev/null 2>&1 || (echo "Démarrer hydrosea-infra avant la Preview." && exit 2)
	@HYDROSEA_ENV=local ./scripts/preparer-keycloak-preview.sh
	docker compose -f compose.dev.yaml up --build -d
	@echo "HydroSEA : http://localhost:5173 — API : http://localhost:8080/actuator/health"
	@echo "Comptes locaux préparés par Keycloak ; mots de passe dans les variables DEMO_*_PASSWORD."
demo-reset:
	@printf "Réinitialiser uniquement les données locales de démonstration ? [y/N] "; read reponse; [ "$$reponse" = y ]
	@[ "$${HYDROSEA_ENV:-local}" != production ] || (echo "Interdit en production." && exit 3)
	@./scripts/initialiser-demo.sh
	@./scripts/preparer-keycloak-preview.sh
	@curl --fail --silent http://localhost:8080/actuator/health >/dev/null
	@echo "Démonstration réinitialisée."
tester:
	cd backend && ./mvnw -B test
	cd frontend && npm test
tester-integration:
	cd backend && ./mvnw -B verify -Pintegration
formater:
	cd frontend && npm run format
analyser:
	cd backend && ./mvnw -B checkstyle:check
	cd frontend && npm run lint && npm run format:check
	node tests/controle-preview.mjs
construire:
	cd backend && ./mvnw -B -DskipTests package
	cd frontend && npm run build
nettoyer:
	cd backend && ./mvnw clean
	cd frontend && npm run format -- --check || true
	rm -rf frontend/dist frontend/coverage
