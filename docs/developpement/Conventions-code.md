# Conventions de code

Les noms métier sont français ; les noms imposés par Java, Spring, REST, OAuth2, JWT, JSON, SQL ou TypeScript restent standards. Un contrôleur valide et traduit HTTP, un Service applicatif orchestre, le domaine protège les invariants et un adaptateur réalise les entrées-sorties.

Une migration publiée n’est jamais modifiée. Chaque évolution utilise une nouvelle version Flyway et son checksum. L’utilisateur applicatif ne reçoit aucun DDL. Les migrations ne contiennent aucune donnée métier fictive.

Le JSON public utilise `snake_case`. Les événements et journaux n’incluent jamais de date de naissance, coordonnées complètes, mot de passe, secret, jeton ou corps sensible. Toute nouvelle dépendance doit être versionnée et justifiée.

Le code frontend suit TypeScript strict, ESLint et Prettier. Les opérations couvertes par OpenAPI passent par le client généré. Les en-têtes Authorization, corrélation, idempotence et version sont centralisés dans la configuration et l’adaptateur `apiTiers`.

