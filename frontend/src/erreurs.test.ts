import { describe, expect, it } from 'vitest';
import { messageErreur } from './erreurs';

describe('messageErreur', () => {
  it('restitue le détail métier reçu par les API de la Preview', () => {
    const erreur = new Error(
      JSON.stringify({
        code: 'CPT-NUMERO-SERIE-EXISTANT',
        detail: 'Un Compteur portant ce numéro de série existe déjà.',
      }),
    );

    expect(messageErreur(erreur, 'Message de repli')).toBe(
      'Un Compteur portant ce numéro de série existe déjà.',
    );
  });

  it('n’affiche pas un faux message de doublon pour une erreur de connexion', () => {
    expect(messageErreur(new TypeError('Failed to fetch'), 'Message de repli')).toBe(
      'Le service HydroSEA est momentanément inaccessible. Réessayez dans quelques instants.',
    );
  });

  it('restitue le contrat canonique de conflit de version', () => {
    const erreur = new Error(
      JSON.stringify({
        code: 'SYS-VERSION-OBSOLETE',
        detail: 'La ressource a été modifiée depuis son chargement.',
      }),
    );
    expect(messageErreur(erreur, 'Message de repli')).toBe(
      'La ressource a été modifiée depuis son chargement.',
    );
  });
});
