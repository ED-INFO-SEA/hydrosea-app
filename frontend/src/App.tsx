import { FormEvent, useEffect, useState } from 'react';
import type { CreerTiers, ModifierTiers, Tiers } from './api/genere';
import { ApiError } from './api/genere';
import { apiTiers } from './api/tiers';
import { keycloak, possedePortee } from './authentification';
import './styles.css';

const messageErreur = (erreur: unknown) => {
  if (erreur instanceof ApiError && typeof erreur.body === 'object' && erreur.body) {
    return (erreur.body as { detail?: string }).detail ?? 'La demande a été refusée.';
  }
  return 'Une erreur inattendue est survenue.';
};

export default function App() {
  const [authentifie, setAuthentifie] = useState(Boolean(keycloak.authenticated));
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [selection, setSelection] = useState<Tiers>();
  const [recherche, setRecherche] = useState('');
  const [erreur, setErreur] = useState('');
  const [categorie, setCategorie] = useState<'PERSONNE_PHYSIQUE' | 'PERSONNE_MORALE'>(
    'PERSONNE_PHYSIQUE',
  );

  useEffect(() => {
    keycloak.onAuthSuccess = () => setAuthentifie(true);
    keycloak.onAuthLogout = () => setAuthentifie(false);
  }, []);

  const charger = async () => {
    try {
      setErreur('');
      setTiers((await apiTiers.rechercher(recherche)).resultats);
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };
  useEffect(() => {
    if (authentifie) void charger();
  }, [authentifie]); // eslint-disable-line react-hooks/exhaustive-deps

  const creer = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    const requete: CreerTiers =
      categorie === 'PERSONNE_PHYSIQUE'
        ? {
            categorie,
            personne_physique: {
              nom: String(donnees.get('nom')),
              prenoms: String(donnees.get('prenoms')),
            },
          }
        : {
            categorie,
            personne_morale: {
              raison_sociale: String(donnees.get('raison_sociale')),
              siret: String(donnees.get('siret')) || undefined,
            },
          };
    try {
      const cree = await apiTiers.creer(requete);
      setSelection(cree);
      await charger();
      evenement.currentTarget.reset();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  const modifier = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (!selection) return;
    const donnees = new FormData(evenement.currentTarget);
    const requete: ModifierTiers = selection.personne_physique
      ? {
          personne_physique: {
            nom: String(donnees.get('nom')),
            prenoms: String(donnees.get('prenoms')),
          },
        }
      : {
          personne_morale: {
            raison_sociale: String(donnees.get('raison_sociale')),
            siret: String(donnees.get('siret')) || undefined,
          },
        };
    try {
      setErreur('');
      setSelection(await apiTiers.modifier(selection, requete));
      await charger();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  if (!authentifie)
    return (
      <main className="connexion">
        <h1>HydroSEA</h1>
        <p>Gestion unifiée du service de l’eau.</p>
        <button onClick={() => void keycloak.login({ redirectUri: location.href })}>
          Se connecter
        </button>
      </main>
    );
  return (
    <>
      <header>
        <h1>HydroSEA</h1>
        <nav aria-label="Navigation principale">
          <button onClick={() => void charger()}>Tiers</button>
          <button
            className="secondaire"
            onClick={() => void keycloak.logout({ redirectUri: location.origin })}
          >
            Se déconnecter
          </button>
        </nav>
      </header>
      <main>
        {erreur && (
          <div className="erreur" role="alert">
            {erreur}
          </div>
        )}
        <section aria-labelledby="liste">
          <h2 id="liste">Tiers</h2>
          <form
            className="recherche"
            onSubmit={(e) => {
              e.preventDefault();
              void charger();
            }}
          >
            <label htmlFor="recherche">Nom, référence ou SIRET</label>
            <input
              id="recherche"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
            <button>Rechercher</button>
          </form>
          <div className="grille">
            <ul className="liste">
              {tiers.map((t) => (
                <li key={t.identifiant_tiers}>
                  <button onClick={() => setSelection(t)}>
                    <strong>{t.reference}</strong>
                    <span>{t.personne_physique?.nom ?? t.personne_morale?.raison_sociale}</span>
                    <small>{t.statut}</small>
                  </button>
                </li>
              ))}
            </ul>
            {selection && (
              <article>
                <h3>{selection.reference}</h3>
                <p>
                  {selection.personne_physique
                    ? `${selection.personne_physique.prenoms} ${selection.personne_physique.nom}`
                    : selection.personne_morale?.raison_sociale}
                </p>
                <p>
                  Catégorie :{' '}
                  {selection.categorie === 'PERSONNE_PHYSIQUE'
                    ? 'Personne physique'
                    : 'Personne morale'}
                </p>
                <p>Statut : {selection.statut}</p>
                {possedePortee('tiers:ecriture') && selection.statut !== 'ARCHIVE' && (
                  <>
                    <form
                      className="formulaire"
                      onSubmit={modifier}
                      key={selection.identifiant_tiers}
                    >
                      {selection.personne_physique ? (
                        <>
                          <label>
                            Nom
                            <input
                              name="nom"
                              required
                              defaultValue={selection.personne_physique.nom}
                            />
                          </label>
                          <label>
                            Prénoms
                            <input
                              name="prenoms"
                              required
                              defaultValue={selection.personne_physique.prenoms}
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            Raison sociale
                            <input
                              name="raison_sociale"
                              required
                              defaultValue={selection.personne_morale?.raison_sociale}
                            />
                          </label>
                          <label>
                            SIRET
                            <input
                              name="siret"
                              pattern="[0-9]{14}"
                              defaultValue={selection.personne_morale?.siret}
                            />
                          </label>
                        </>
                      )}
                      <button>Enregistrer les modifications</button>
                    </form>
                    <button
                      className="danger"
                      onClick={async () => {
                        if (confirm('Archiver ce Tiers ?')) {
                          try {
                            setSelection(
                              await apiTiers.archiver(
                                selection,
                                'Archivage demandé depuis l’application',
                              ),
                            );
                            await charger();
                          } catch (e) {
                            setErreur(messageErreur(e));
                          }
                        }
                      }}
                    >
                      Archiver
                    </button>
                  </>
                )}
              </article>
            )}
          </div>
        </section>
        {possedePortee('tiers:ecriture') && (
          <section aria-labelledby="creation">
            <h2 id="creation">Créer un Tiers</h2>
            <form className="formulaire" onSubmit={creer}>
              <fieldset>
                <legend>Catégorie</legend>
                <label>
                  <input
                    type="radio"
                    name="categorie"
                    checked={categorie === 'PERSONNE_PHYSIQUE'}
                    onChange={() => setCategorie('PERSONNE_PHYSIQUE')}
                  />{' '}
                  Personne physique
                </label>
                <label>
                  <input
                    type="radio"
                    name="categorie"
                    checked={categorie === 'PERSONNE_MORALE'}
                    onChange={() => setCategorie('PERSONNE_MORALE')}
                  />{' '}
                  Personne morale
                </label>
              </fieldset>
              {categorie === 'PERSONNE_PHYSIQUE' ? (
                <>
                  <label>
                    Nom
                    <input name="nom" required autoComplete="family-name" />
                  </label>
                  <label>
                    Prénoms
                    <input name="prenoms" required autoComplete="given-name" />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Raison sociale
                    <input name="raison_sociale" required />
                  </label>
                  <label>
                    SIRET
                    <input name="siret" inputMode="numeric" pattern="[0-9]{14}" />
                  </label>
                </>
              )}
              <button>Créer le Tiers</button>
            </form>
          </section>
        )}
      </main>
    </>
  );
}
