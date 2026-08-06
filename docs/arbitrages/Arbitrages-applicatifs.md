# Arbitrages applicatifs

Chaque recommandation reste révisable avant l’étape indiquée.

| Sujet | Contexte et options | Recommandation | Impacts | Décision avant |
|---|---|---|---|---|
| JPA ou JDBC | ORM général ou SQL maîtrisé | JPA pour le socle transactionnel, JDBC par adaptateur Tiers | maîtrise des schémas, discipline accrue | extension du deuxième agrégat |
| Serveur OpenAPI | génération serveur ou implémentation contrôlée | implémentation contrôlée et tests contractuels | noms français conservés, contrôle CI requis | élargissement de l’API |
| Déploiement | monolithe ou microservices | monolithe modulaire | transactions simples, extraction future possible | premier besoin de cadence indépendante |
| Références fonctionnelles | séquence, UUID affiché ou service central | séquence préfixée par objet | lisible, contention faible | reprise de données |
| Cache | absent, local ou distribué | aucun cache pour Tiers | cohérence immédiate | problème de performance mesuré |
| Idempotence | 24 h, 7 jours ou durée métier | 24 h configurable | volume borné, rejouabilité limitée | exposition à des partenaires |
| Boîte d’envoi | synchrone ou différée | différée, lot verrouillé | résilience, latence éventuelle | engagement de délai événementiel |
| Frontend | React, Vue ou rendu serveur | React/Vite séparé | client généré, déploiement distinct futur | identité graphique finale |
| Droits | portées globales ou permissions fines | portées par domaine et action | simple pour le noyau | rôles contractuels définitifs |
| Coordonnées | tables du noyau ou document JSON | tables normalisées du noyau, hors lot | qualité et historisation | parcours coordonnées |
| Doublons | blocage simple, score ou moteur | égalité ciblée bloquante et signalement | faux positifs possibles | fusion de Tiers |
| Fusion | survivant manuel ou automatique | À arbitrer : manuel ou règles de priorité ; impact sur contrats et audit | hors lot | `BS-TIE-007` |
| Tests | pyramide locale ou tout bout en bout | domaine + architecture + Testcontainers + parcours web réduit | rapide et réaliste | pipeline de déploiement |
| Packaging | jar/image unique ou modules séparés | image backend et image frontend | simple localement | déploiement de production |

