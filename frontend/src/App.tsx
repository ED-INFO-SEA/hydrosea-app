import { FormEvent, useEffect, useState } from 'react';
import { ApiError } from './api/genere';
import { keycloak } from './authentification';
import { SelecteurAdresse, SelecteurPointConsommation } from './Selecteurs';
import { GestionTiers } from './GestionTiers';
import './styles.css';

type Page = 'Accueil' | 'Tiers' | 'Points' | 'Contrats' | 'Compteurs' | 'Synthèse' | 'Parcours';
type Objet = Record<string, unknown>;
const pages: Page[] = [
  'Accueil',
  'Tiers',
  'Points',
  'Contrats',
  'Compteurs',
  'Synthèse',
  'Parcours',
];
const libelle = (o: Objet) =>
  String(o.reference ?? o.numero_serie ?? o.identifiant_tiers ?? o.id ?? 'Fiche');
const api = async (path: string, options?: RequestInit) => {
  const r = await fetch(`/api/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!r.ok) throw new Error(`Erreur API ${r.status}`);
  return r.json() as Promise<Objet>;
};

export default function App() {
  const [authentifie, setAuthentifie] = useState(Boolean(keycloak.authenticated));
  const [page, setPage] = useState<Page>('Accueil');
  const [objets, setObjets] = useState<Objet[]>([]);
  const [selection, setSelection] = useState<Objet>();
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    keycloak.onAuthSuccess = () => setAuthentifie(true);
    keycloak.onAuthLogout = () => setAuthentifie(false);
  }, []);
  const charger = async (p = page) => {
    const chemin =
      p === 'Points'
        ? '/points-consommation'
        : p === 'Contrats'
          ? '/contrats-abonnement'
          : p === 'Compteurs'
            ? '/compteurs'
            : p === 'Tiers'
              ? '/tiers'
              : undefined;
    if (!chemin) return;
    try {
      const r = (await api(chemin)) as { resultats?: Objet[] };
      setObjets(r.resultats ?? []);
    } catch (e) {
      setErreur(
        e instanceof ApiError ? 'La demande a été refusée.' : 'Service momentanément indisponible.',
      );
    }
  };
  useEffect(() => {
    if (authentifie) void charger();
  }, [authentifie, page]); // eslint-disable-line react-hooks/exhaustive-deps
  const naviguer = (p: Page) => {
    setPage(p);
    setSelection(undefined);
    setErreur('');
    setMessage('');
  };
  const creer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    let chemin = '';
    let corps: Objet = {};
    if (page === 'Points') {
      chemin = '/points-consommation';
      corps = {
        usage: d.get('usage'),
        identifiant_adresse: d.get('adresse'),
        date_preparation: new Date().toISOString(),
      };
    }
    if (page === 'Contrats') {
      chemin = '/contrats-abonnement';
      corps = {
        nature_abonnement: d.get('nature'),
        identifiant_point_consommation: d.get('point'),
        date_demande: new Date().toISOString().slice(0, 10),
        date_effet_souhaitee: d.get('effet'),
        participants: [],
      };
    }
    if (page === 'Compteurs') {
      chemin = '/compteurs';
      corps = {
        numero_serie: d.get('serie'),
        fabricant: d.get('fabricant'),
        modele: d.get('modele'),
        calibre: d.get('calibre'),
      };
    }
    try {
      const cree = await api(chemin, {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify(corps),
      });
      setSelection(cree);
      setMessage(`${page.slice(0, -1)} créé avec succès.`);
      await charger();
    } catch {
      setErreur('Vérifiez les champs et les règles métier avant de recommencer.');
    }
  };
  if (!authentifie)
    return (
      <main className="connexion">
        <div className="marque">
          H<span>₂</span>
        </div>
        <h1>HydroSEA</h1>
        <p>Le service de l’eau, dans un dossier clair et partagé.</p>
        <button onClick={() => void keycloak.login({ redirectUri: location.href })}>
          Se connecter
        </button>
        <small>Preview 0.1 · environnement de démonstration</small>
      </main>
    );
  return (
    <div className="application">
      <aside>
        <div className="logo">
          <b>
            H<span>₂</span>
          </b>
          <strong>HydroSEA</strong>
          <small>Preview 0.1</small>
        </div>
        <nav aria-label="Navigation principale">
          {pages.map((p) => (
            <button key={p} className={page === p ? 'actif' : ''} onClick={() => naviguer(p)}>
              {p}
            </button>
          ))}
        </nav>
        <button
          className="deconnexion"
          onClick={() => void keycloak.logout({ redirectUri: location.origin })}
        >
          Se déconnecter
        </button>
      </aside>
      <main>
        <header>
          <div>
            <small>Dossier usager</small>
            <h1>{page}</h1>
          </div>
          <span className="environnement">Démonstration locale</span>
        </header>
        {erreur && (
          <div className="alerte erreur" role="alert">
            {erreur}
          </div>
        )}
        {message && (
          <div className="alerte succes" role="status">
            {message}
          </div>
        )}
        {page === 'Accueil' && <Accueil naviguer={naviguer} />}{' '}
        {page === 'Parcours' && <Parcours naviguer={naviguer} />}{' '}
        {page === 'Synthèse' && <Synthese />} {page === 'Tiers' && <GestionTiers />}
        {['Points', 'Contrats', 'Compteurs'].includes(page) && (
          <section>
            <div className="barre">
              <input
                aria-label={`Rechercher dans ${page}`}
                placeholder="Référence, nom ou numéro…"
              />
              <button onClick={() => void charger()}>Rechercher</button>
            </div>
            <div className="colonnes">
              <div>
                <h2>{page}</h2>
                <ul className="cartes">
                  {objets.map((o, i) => (
                    <li key={String(o.id ?? o.identifiant_tiers ?? i)}>
                      <button onClick={() => setSelection(o)}>
                        <strong>{libelle(o)}</strong>
                        <span>{String(o.statut ?? o.usage ?? 'Actif')}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {objets.length === 0 && (
                  <p className="vide">Aucun résultat. Vous pouvez créer la première fiche.</p>
                )}
              </div>
              <article>
                <h2>{selection ? libelle(selection) : `Créer · ${page}`}</h2>
                {selection ? (
                  <Fiche objet={selection} />
                ) : (
                  <Formulaire page={page as 'Points' | 'Contrats' | 'Compteurs'} creer={creer} />
                )}
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
function Accueil({ naviguer }: { naviguer: (p: Page) => void }) {
  const [indicateurs, setIndicateurs] = useState<Record<string, number>>();
  useEffect(() => {
    void api('/preview/indicateurs').then((valeur) =>
      setIndicateurs(valeur as Record<string, number>),
    );
  }, []);
  return (
    <>
      <section className="hero">
        <div>
          <span className="pastille">Parcours prêt</span>
          <h2>Construire un dossier complet, simplement.</h2>
          <p>
            Créez le Tiers, reliez les Points, activez le Contrat puis posez le Compteur. HydroSEA
            conserve chaque étape.
          </p>
          <button onClick={() => naviguer('Parcours')}>Démarrer le parcours guidé</button>
        </div>
        <div className="schema">
          <b>Tiers</b>
          <i>→</i>
          <b>Point</b>
          <i>→</i>
          <b>Contrat</b>
          <i>→</i>
          <b>Compteur</b>
        </div>
      </section>
      <div className="indicateurs">
        {[
          ['Tiers actifs', indicateurs?.tiers_actifs],
          ['Points ouverts', indicateurs?.points_ouverts],
          ['Contrats actifs', indicateurs?.contrats_actifs],
          ['Compteurs posés', indicateurs?.compteurs_poses],
        ].map(([l, v]) => (
          <article key={String(l)}>
            <small>{l}</small>
            <strong>{v ?? '—'}</strong>
            <span>Données courantes</span>
          </article>
        ))}
      </div>
    </>
  );
}
function Parcours({ naviguer }: { naviguer: (p: Page) => void }) {
  const etapes: Page[] = ['Tiers', 'Points', 'Contrats', 'Compteurs', 'Synthèse'];
  return (
    <section>
      <span className="pastille">Mode guidé</span>
      <h2>Parcours de démonstration</h2>
      <p>Chaque étape utilise les mêmes fiches et les mêmes API que l’application.</p>
      <ol className="etapes">
        {etapes.map((e, i) => (
          <li key={e}>
            <b>{i + 1}</b>
            <div>
              <strong>{e}</strong>
              <p>
                {
                  [
                    'Rechercher ou créer le titulaire.',
                    'Créer la desserte, le Point, rattacher puis ouvrir.',
                    'Ajouter le titulaire, valider puis activer.',
                    'Enregistrer et poser le Compteur.',
                    'Vérifier le dossier et son activité.',
                  ][i]
                }
              </p>
            </div>
            <button onClick={() => naviguer(e)}>Ouvrir</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
function Synthese() {
  const [points, setPoints] = useState<Objet[]>([]);
  const [point, setPoint] = useState('');
  const [dossier, setDossier] = useState<Objet>();
  useEffect(() => {
    void api('/points-consommation').then((page) => {
      const resultats = (page as { resultats?: Objet[] }).resultats ?? [];
      setPoints(resultats);
    });
  }, []);
  useEffect(() => {
    if (point) void api(`/preview/dossiers/${point}`).then(setDossier);
  }, [point]);
  const resume = (nom: string) => dossier?.[nom] as Objet | undefined;
  const activite = (dossier?.activite_recente as Objet[] | undefined) ?? [];
  return (
    <section>
      <h2>Synthèse du dossier</h2>
      <label>
        Point de consommation
        <select value={point} onChange={(e) => setPoint(e.target.value)}>
          <option value="">Sélectionner un Point</option>
          {points.map((p) => (
            <option key={String(p.id)} value={String(p.id)}>
              {String(p.reference)} · {String(p.statut)}
            </option>
          ))}
        </select>
      </label>
      {dossier && (
        <>
          <h2>{String(resume('point_consommation')?.reference)}</h2>
          <div className="relations">
            <article>
              <small>Point de desserte</small>
              <b>{String(resume('point_desserte_courant')?.reference ?? 'Non rattaché')}</b>
              <span>{String(resume('point_desserte_courant')?.statut ?? '')}</span>
            </article>
            <article>
              <small>Contrat actif</small>
              <b>{String(resume('contrat_actif')?.reference ?? 'Aucun')}</b>
              <span>{String(resume('titulaire_principal')?.libelle ?? '')}</span>
            </article>
            <article>
              <small>Compteur courant</small>
              <b>{String(resume('compteur_actif')?.reference ?? 'Aucun')}</b>
              <span>{String(resume('compteur_actif')?.statut ?? '')}</span>
            </article>
          </div>
          <h3>Historique du dossier</h3>
          <div className="frise">
            {activite.map((a) => (
              <p key={String(a.correlation)}>
                <time>{new Date(String(a.date_metier)).toLocaleString('fr-FR')}</time>
                <b>{String(a.libelle)}</b>
                <span>{String(a.reference_agregat ?? '')}</span>
              </p>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
function Fiche({ objet }: { objet: Objet }) {
  return (
    <dl className="fiche">
      {Object.entries(objet)
        .filter(([, v]) => typeof v !== 'object' && v != null)
        .slice(0, 12)
        .map(([k, v]) => (
          <div key={k}>
            <dt>{k.replaceAll('_', ' ')}</dt>
            <dd>{String(v)}</dd>
          </div>
        ))}
    </dl>
  );
}
function Formulaire({
  page,
  creer,
}: {
  page: 'Points' | 'Contrats' | 'Compteurs';
  creer: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const [adresse, setAdresse] = useState('');
  const [point, setPoint] = useState('');
  return (
    <form className="formulaire" onSubmit={creer}>
      {page === 'Points' && (
        <>
          <label>
            Usage obligatoire
            <input name="usage" required defaultValue="HABITATION" />
          </label>
          <label>
            Adresse de situation
            <SelecteurAdresse valeur={adresse} onChange={setAdresse} requis />
            <input name="adresse" type="hidden" value={adresse} />
          </label>
        </>
      )}
      {page === 'Contrats' && (
        <>
          <label>
            Nature d’abonnement
            <input name="nature" required defaultValue="EAU_POTABLE" />
          </label>
          <label>
            Point de consommation
            <SelecteurPointConsommation valeur={point} onChange={setPoint} requis />
            <input name="point" type="hidden" value={point} />
          </label>
          <label>
            Date d’effet
            <input name="effet" required type="date" />
          </label>
        </>
      )}
      {page === 'Compteurs' && (
        <>
          <label>
            Numéro de série
            <input name="serie" required />
          </label>
          <label>
            Fabricant
            <input name="fabricant" required />
          </label>
          <label>
            Modèle
            <input name="modele" />
          </label>
          <label>
            Calibre
            <input name="calibre" />
          </label>
        </>
      )}
      <button>Créer</button>
    </form>
  );
}
