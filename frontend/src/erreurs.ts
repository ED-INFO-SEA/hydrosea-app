import { ApiError } from './api/genere';

type ErreurApi = { code?: string; titre?: string; detail?: string };

export function messageErreur(erreur: unknown, messageParDefaut: string) {
  if (erreur instanceof ApiError) {
    const corps = erreur.body as ErreurApi | undefined;
    if (corps?.detail) return corps.detail;
    if (corps?.titre) return corps.titre;
    if (erreur.status === 412) return 'La fiche a été modifiée. Rechargez-la avant de recommencer.';
    if (erreur.status === 409) return 'Cette opération entre en conflit avec une donnée existante.';
    if (erreur.status === 400) return 'Certaines données saisies sont invalides.';
  }
  if (erreur instanceof TypeError && erreur.message === 'Failed to fetch') {
    return 'Le service HydroSEA est momentanément inaccessible. Réessayez dans quelques instants.';
  }
  if (erreur instanceof Error && erreur.message && erreur.message !== 'Failed to fetch') {
    try {
      const corps = JSON.parse(erreur.message) as ErreurApi;
      if (corps.detail) return corps.detail;
    } catch {
      // Le texte ne provient pas nécessairement d’une réponse JSON.
    }
  }
  return messageParDefaut;
}
