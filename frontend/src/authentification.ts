import Keycloak from 'keycloak-js';
import { OpenAPI } from './api/genere';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://auth.hydrosea.local',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'hydrosea',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT ?? 'hydrosea-web',
});

OpenAPI.BASE = import.meta.env.VITE_API_URL ?? '';
OpenAPI.TOKEN = async () => {
  if (keycloak.authenticated) await keycloak.updateToken(30);
  return keycloak.token ?? '';
};

export const possedePortee = (portee: string) => {
  const contenu = keycloak.tokenParsed as { scope?: string } | undefined;
  return contenu?.scope?.split(' ').includes(portee) ?? false;
};
