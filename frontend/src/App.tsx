import { FormEvent, useEffect, useState } from 'react';
import { ApiError } from './api/genere';
import { keycloak } from './authentification';
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
        {page === 'Synthèse' && <Synthese />}{' '}
        {['Tiers', 'Points', 'Contrats', 'Compteurs'].includes(page) && (
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
                ) : page === 'Tiers' ? (
                  <p>La création des Tiers est disponible depuis la fiche Tiers dédiée du socle.</p>
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
          ['Tiers actifs', '24'],
          ['Points ouverts', '18'],
          ['Contrats actifs', '16'],
          ['Compteurs posés', '15'],
        ].map(([l, v]) => (
          <article key={l}>
            <small>{l}</small>
            <strong>{v}</strong>
            <span>Jeu de démonstration</span>
          </article>
        ))}
      </div>
      <section>
        <h2>Activité récente</h2>
        <div className="frise">
          <p>
            <time>09:42</time>
            <b>Compteur posé</b> sur PC-DEMO-001
          </p>
          <p>
            <time>09:37</time>
            <b>Contrat activé</b> CA-DEMO-001
          </p>
          <p>
            <time>09:31</time>
            <b>Point ouvert</b> PC-DEMO-001
          </p>
        </div>
      </section>
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
  return (
    <section>
      <span className="pastille">Dossier complet</span>
      <h2>PC-DEMO-001 · 12 rue des Sources</h2>
      <div className="relations">
        <article>
          <small>Point de desserte</small>
          <b>PD-DEMO-001</b>
          <span>Disponible</span>
        </article>
        <article>
          <small>Contrat actif</small>
          <b>CA-DEMO-001</b>
          <span>Titulaire : Camille Rivière</span>
        </article>
        <article>
          <small>Compteur courant</small>
          <b>SEA-2026-0001</b>
          <span>Posé</span>
        </article>
      </div>
      <h3>Historique du dossier</h3>
      <div className="frise">
        <p>
          <time>7 août · 09:42</time>
          <b>Compteur posé</b>
          <span>Agent exploitation</span>
        </p>
        <p>
          <time>7 août · 09:37</time>
          <b>Contrat activé</b>
          <span>Agent relation usagers</span>
        </p>
        <p>
          <time>7 août · 09:31</time>
          <b>Point de consommation ouvert</b>
          <span>Agent relation usagers</span>
        </p>
        <p>
          <time>7 août · 09:22</time>
          <b>Rattachement créé</b>
          <span>Agent relation usagers</span>
        </p>
      </div>
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
  return (
    <form className="formulaire" onSubmit={creer}>
      {page === 'Points' && (
        <>
          <label>
            Usage obligatoire
            <input name="usage" required defaultValue="HABITATION" />
          </label>
          <label>
            Identifiant de l’adresse
            <input name="adresse" required placeholder="UUID de l’adresse" />
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
            <input name="point" required placeholder="UUID du Point" />
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
