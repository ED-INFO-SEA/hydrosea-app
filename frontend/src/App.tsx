import { useEffect, useState } from 'react';
import { keycloak } from './authentification';
import { GestionTiers } from './GestionTiers';
import { GestionCompteurs, GestionContrats, GestionPoints } from './FichesPreview';
import { useParcours } from './ContexteParcours';
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
  useEffect(() => {
    keycloak.onAuthSuccess = () => setAuthentifie(true);
    keycloak.onAuthLogout = () => setAuthentifie(false);
  }, []);
  const naviguer = (p: Page) => {
    setPage(p);
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
        {page === 'Accueil' && <Accueil naviguer={naviguer} />}{' '}
        {page === 'Parcours' && <Parcours naviguer={naviguer} />}{' '}
        {page === 'Synthèse' && <Synthese />} {page === 'Tiers' && <GestionTiers />}
        {page === 'Points' && <GestionPoints />}
        {page === 'Contrats' && <GestionContrats />}
        {page === 'Compteurs' && <GestionCompteurs />}
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
  const { resultats } = useParcours();
  const etapes: Page[] = ['Tiers', 'Points', 'Contrats', 'Compteurs', 'Synthèse'];
  const terminees = [
    Boolean(resultats.tiers),
    Boolean(resultats.pointConsommation),
    Boolean(resultats.contrat),
    Boolean(resultats.compteur),
    false,
  ];
  const premiereAfaire = terminees.findIndex((v) => !v);
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
            <span className="pastille">
              {terminees[i] ? 'Terminé' : i === premiereAfaire ? 'En cours' : 'À faire'}
            </span>
            <button onClick={() => naviguer(e)}>
              {i === premiereAfaire ? 'Continuer' : 'Ouvrir'}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
function Synthese() {
  const { resultats: resultatsParcours } = useParcours();
  const [points, setPoints] = useState<Objet[]>([]);
  const [point, setPoint] = useState('');
  const [dossier, setDossier] = useState<Objet>();
  useEffect(() => {
    void api('/points-consommation').then((page) => {
      const resultats = (page as { resultats?: Objet[] }).resultats ?? [];
      setPoints(resultats);
      if (resultats.length && !point)
        setPoint(
          (resultats.find((p) => p.id === resultatsParcours.pointConsommation)?.id as string) ?? '',
        );
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
