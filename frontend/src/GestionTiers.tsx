import { FormEvent, useEffect, useState } from 'react';
import type { CreerTiers, ModifierTiers, Tiers } from './api/genere';
import { apiTiers } from './api/tiers';
import { useParcours } from './ContexteParcours';

export function GestionTiers() {
  const { memoriser } = useParcours();
  const [liste, setListe] = useState<Tiers[]>([]),
    [selection, setSelection] = useState<Tiers>(),
    [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState<'PERSONNE_PHYSIQUE' | 'PERSONNE_MORALE'>(
    'PERSONNE_PHYSIQUE',
  );
  const [erreur, setErreur] = useState('');
  const charger = async () => {
    try {
      setListe((await apiTiers.rechercher(recherche)).resultats);
    } catch {
      setErreur('La recherche des Tiers a échoué.');
    }
  };
  useEffect(() => {
    void charger();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const creer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const requete: CreerTiers =
      categorie === 'PERSONNE_PHYSIQUE'
        ? {
            categorie,
            personne_physique: { nom: String(d.get('nom')), prenoms: String(d.get('prenoms')) },
          }
        : {
            categorie,
            personne_morale: {
              raison_sociale: String(d.get('raison')),
              siret: String(d.get('siret')) || undefined,
            },
          };
    try {
      const cree = await apiTiers.creer(requete);
      setSelection(cree);
      memoriser('tiers', cree.identifiant_tiers);
      await charger();
      e.currentTarget.reset();
    } catch {
      setErreur('Création refusée : vérifiez les données ou un éventuel doublon.');
    }
  };
  const modifier = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selection) return;
    const d = new FormData(e.currentTarget);
    const r: ModifierTiers = selection.personne_physique
      ? { personne_physique: { nom: String(d.get('nom')), prenoms: String(d.get('prenoms')) } }
      : {
          personne_morale: {
            raison_sociale: String(d.get('raison')),
            siret: String(d.get('siret')) || undefined,
          },
        };
    try {
      setSelection(await apiTiers.modifier(selection, r));
      await charger();
    } catch {
      setErreur('Modification refusée ou fiche devenue obsolète.');
    }
  };
  return (
    <section>
      <h2>Tiers</h2>
      {erreur && (
        <p className="alerte erreur" role="alert">
          {erreur}
        </p>
      )}
      <form
        className="barre"
        onSubmit={(e) => {
          e.preventDefault();
          void charger();
        }}
      >
        <input
          aria-label="Rechercher un Tiers"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Nom, référence ou SIRET"
        />
        <button>Rechercher</button>
      </form>
      <div className="colonnes">
        <div>
          <ul className="cartes">
            {liste.map((t) => (
              <li key={t.identifiant_tiers}>
                <button onClick={() => setSelection(t)}>
                  <strong>{t.reference}</strong>
                  <span>
                    {t.personne_physique
                      ? `${t.personne_physique.prenoms} ${t.personne_physique.nom}`
                      : t.personne_morale?.raison_sociale}
                  </span>
                  <small>{t.statut}</small>
                </button>
              </li>
            ))}
          </ul>
          <h3>Créer un Tiers</h3>
          <form className="formulaire" onSubmit={creer}>
            <fieldset>
              <legend>Catégorie</legend>
              <label>
                <input
                  type="radio"
                  checked={categorie === 'PERSONNE_PHYSIQUE'}
                  onChange={() => setCategorie('PERSONNE_PHYSIQUE')}
                />{' '}
                Personne physique
              </label>
              <label>
                <input
                  type="radio"
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
                  <input name="nom" required />
                </label>
                <label>
                  Prénoms
                  <input name="prenoms" required />
                </label>
              </>
            ) : (
              <>
                <label>
                  Raison sociale
                  <input name="raison" required />
                </label>
                <label>
                  SIRET
                  <input name="siret" pattern="[0-9]{14}" />
                </label>
              </>
            )}
            <button>Créer le Tiers</button>
          </form>
        </div>
        <article>
          {selection && (
            <>
              <h3>{selection.reference}</h3>
              <p>
                {selection.personne_physique
                  ? `${selection.personne_physique.prenoms} ${selection.personne_physique.nom}`
                  : selection.personne_morale?.raison_sociale}
              </p>
              <p>Statut : {selection.statut}</p>
              {selection.statut !== 'ARCHIVE' && (
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
                            defaultValue={selection.personne_physique.nom}
                            required
                          />
                        </label>
                        <label>
                          Prénoms
                          <input
                            name="prenoms"
                            defaultValue={selection.personne_physique.prenoms}
                            required
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          Raison sociale
                          <input
                            name="raison"
                            defaultValue={selection.personne_morale?.raison_sociale}
                            required
                          />
                        </label>
                        <label>
                          SIRET
                          <input name="siret" defaultValue={selection.personne_morale?.siret} />
                        </label>
                      </>
                    )}
                    <button>Enregistrer</button>
                  </form>
                  <button
                    className="danger"
                    onClick={() =>
                      void apiTiers
                        .archiver(selection, 'Archivage demandé depuis la Preview')
                        .then((t) => {
                          setSelection(t);
                          void charger();
                        })
                    }
                  >
                    Archiver le Tiers
                  </button>
                </>
              )}
            </>
          )}
        </article>
      </div>
    </section>
  );
}
