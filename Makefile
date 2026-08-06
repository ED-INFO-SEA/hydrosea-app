SHELL := /bin/sh
.PHONY: verifier installer generer-api demarrer-backend demarrer-frontend demarrer tester tester-integration formater analyser construire nettoyer
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
construire:
	cd backend && ./mvnw -B -DskipTests package
	cd frontend && npm run build
nettoyer:
	cd backend && ./mvnw clean
	cd frontend && npm run format -- --check || true
	rm -rf frontend/dist frontend/coverage

