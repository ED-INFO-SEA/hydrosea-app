# Sécurité applicative

Keycloak est le fournisseur d’identité local. Le navigateur emploie Authorization Code Flow avec PKCE et ne contient aucun secret client. Les jetons restent en mémoire, sont renouvelés peu avant expiration et sont supprimés par une déconnexion Keycloak complète.

Le backend refuse toute requête par défaut, sauf `/actuator/health`. Il vérifie la signature JWT, l’`issuer`, l’audience `hydrosea-api` et les portées. Le parcours Tiers exige `tiers:lecture` ou `tiers:ecriture`. Les masquages frontend améliorent l’ergonomie mais ne remplacent jamais le contrôle serveur. Les refus utilisent le format `ErreurApi` avec HTTP 401 ou 403.

L’identité utile peut être propagée dans le contexte de sécurité et les journaux, sans jeton ni donnée personnelle complète. Les futurs comptes techniques utiliseront OAuth2 Client Credentials, un client par intégration et des portées minimales.

Le profil local est explicite et n’active aucune authentification simulée. L’intégration utilise un domaine Keycloak isolé. La production devra employer un coffre de secrets, des URI HTTPS, une rotation, une révocation et des comptes distincts. Aucun secret n’est conservé dans Git ; `.env` est ignoré.

