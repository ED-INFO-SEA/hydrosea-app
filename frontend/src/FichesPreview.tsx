import { FormEvent, useEffect, useState } from 'react';
import { keycloak } from './authentification';
import { useParcours } from './ContexteParcours';
import {
  SelecteurAdresse,
  SelecteurPointConsommation,
  SelecteurPointDesserte,
  SelecteurTiers,
} from './Selecteurs';

type Identifie = { id: string; version: number };
type PointDesserte = Identifie & { reference: string; statut: string; identifiant_adresse: string };
type PointConsommation = Identifie & {
  reference: string;
  statut: string;
  usage: string;
  identifiant_adresse: string;
};
type Contrat = Identifie & {
  reference: string;
  statut: string;
  nature_abonnement: string;
  point_consommation_id: string;
  date_effet: string;
};
type Compteur = Identifie & {
  numero_serie: string;
  statut: string;
  fabricant: string;
  modele?: string;
  calibre?: string;
};
type Affectation = {
  id: string;
  compteur_id: string;
  point_consommation_id: string;
  index_pose: number;
  reference_intervention: string;
};
type Page<T> = { resultats: T[] };
const appel = async <T,>(chemin: string, init?: RequestInit) => {
  const r = await fetch(`/api/v1${chemin}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<T>;
};
const commande = <T,>(chemin: string, corps: unknown, version?: number) =>
  appel<T>(chemin, {
    method: 'POST',
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
      ...(version ? { 'If-Match': `"${version}"` } : {}),
    },
    body: JSON.stringify(corps),
  });

export function FichePointDesserte({
  objet,
  onChange,
}: {
  objet: PointDesserte;
  onChange: (v: PointDesserte) => void;
}) {
  return (
    <article aria-label="Fiche Point de desserte">
      <h2>{objet.reference}</h2>
      <dl className="fiche">
        <div>
          <dt>État</dt>
          <dd>{objet.statut}</dd>
        </div>
        <div>
          <dt>Adresse</dt>
          <dd>{objet.identifiant_adresse}</dd>
        </div>
        <div>
          <dt>Version</dt>
          <dd>{objet.version}</dd>
        </div>
      </dl>
      {objet.statut === 'CREE' && (
        <button
          onClick={() =>
            void appel<PointDesserte>(`/points-desserte/${objet.id}/rendre-disponible`, {
              method: 'POST',
              headers: { 'If-Match': `"${objet.version}"` },
              body: JSON.stringify({ motif: 'mise en service' }),
            }).then(onChange)
          }
        >
          Rendre disponible
        </button>
      )}
    </article>
  );
}
export function FichePointConsommation({
  objet,
  onChange,
}: {
  objet: PointConsommation;
  onChange: (v: PointConsommation) => void;
}) {
  const [desserte, setDesserte] = useState('');
  const [usage, setUsage] = useState(objet.usage);
  return (
    <article aria-label="Fiche Point de consommation">
      <h2>{objet.reference}</h2>
      <dl className="fiche">
        <div>
          <dt>État</dt>
          <dd>{objet.statut}</dd>
        </div>
        <div>
          <dt>Usage</dt>
          <dd>{objet.usage}</dd>
        </div>
        <div>
          <dt>Version</dt>
          <dd>{objet.version}</dd>
        </div>
      </dl>
      {objet.statut !== 'OUVERT' && (
        <>
          <label>
            Usage
            <input value={usage} onChange={(e) => setUsage(e.target.value)} />
          </label>
          <button
            onClick={() =>
              void appel<PointConsommation>(`/points-consommation/${objet.id}`, {
                method: 'PATCH',
                headers: { 'If-Match': `"${objet.version}"` },
                body: JSON.stringify({ usage }),
              }).then(onChange)
            }
          >
            Modifier
          </button>
          <label>
            Point de desserte
            <SelecteurPointDesserte valeur={desserte} onChange={setDesserte} requis />
          </label>
          <button
            disabled={!desserte}
            onClick={() =>
              void commande<PointConsommation>(
                `/points-consommation/${objet.id}/rattachements-desserte`,
                {
                  identifiant_point_desserte: desserte,
                  date_debut_validite: new Date().toISOString(),
                },
              ).then(onChange)
            }
          >
            Rattacher
          </button>
          <button
            onClick={() =>
              void commande<PointConsommation>(
                `/points-consommation/${objet.id}/ouvrir`,
                { motif: 'ouverture' },
                objet.version,
              ).then(onChange)
            }
          >
            Ouvrir
          </button>
        </>
      )}
    </article>
  );
}

export function GestionPoints() {
  const { memoriser } = useParcours();
  const [dessertes, setDessertes] = useState<PointDesserte[]>([]),
    [points, setPoints] = useState<PointConsommation[]>([]);
  const [selectionD, setSelectionD] = useState<PointDesserte>(),
    [selectionP, setSelectionP] = useState<PointConsommation>();
  const [adresse, setAdresse] = useState('');
  const charger = () =>
    Promise.all([
      appel<Page<PointDesserte>>('/points-desserte').then((r) => setDessertes(r.resultats)),
      appel<Page<PointConsommation>>('/points-consommation').then((r) => setPoints(r.resultats)),
    ]);
  useEffect(() => {
    void charger();
  }, []);
  const creerD = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void commande<PointDesserte>('/points-desserte', {
      identifiant_commune: '00000000-0000-0000-0000-000000000001',
      identifiant_adresse: adresse,
    }).then((v) => {
      setSelectionD(v);
      memoriser('pointDesserte', v.id);
      void charger();
    });
  };
  const creerP = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    void commande<PointConsommation>('/points-consommation', {
      usage: d.get('usage'),
      identifiant_adresse: adresse,
    }).then((v) => {
      setSelectionP(v);
      memoriser('pointConsommation', v.id);
      void charger();
    });
  };
  return (
    <section>
      <div className="colonnes">
        <div>
          <h2>Points de desserte</h2>
          <ul className="cartes">
            {dessertes.map((v) => (
              <li key={v.id}>
                <button
                  onClick={() => {
                    setSelectionD(v);
                    setSelectionP(undefined);
                  }}
                >
                  <strong>{v.reference}</strong>
                  <span>{v.statut}</span>
                </button>
              </li>
            ))}
          </ul>
          <form className="formulaire" onSubmit={creerD}>
            <h3>Créer une desserte</h3>
            <SelecteurAdresse valeur={adresse} onChange={setAdresse} requis />
            <button>Créer</button>
          </form>
        </div>
        {selectionD ? (
          <FichePointDesserte
            objet={selectionD}
            onChange={(v) => {
              setSelectionD(v);
              void charger();
            }}
          />
        ) : (
          <div>
            <h2>Points de consommation</h2>
            <ul className="cartes">
              {points.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => {
                      setSelectionP(v);
                      setSelectionD(undefined);
                    }}
                  >
                    <strong>{v.reference}</strong>
                    <span>{v.statut}</span>
                  </button>
                </li>
              ))}
            </ul>
            <form className="formulaire" onSubmit={creerP}>
              <h3>Créer un Point</h3>
              <input name="usage" defaultValue="HABITATION" required />
              <SelecteurAdresse valeur={adresse} onChange={setAdresse} requis />
              <button>Créer</button>
            </form>
          </div>
        )}
      </div>
      {selectionP && (
        <FichePointConsommation
          objet={selectionP}
          onChange={(v) => {
            setSelectionP(v);
            void charger();
          }}
        />
      )}
    </section>
  );
}

export function FicheContratAbonnement({
  objet,
  onChange,
}: {
  objet: Contrat;
  onChange: (v: Contrat) => void;
}) {
  const [tiers, setTiers] = useState('');
  const [historique, setHistorique] = useState<{ libelle: string; date_metier: string }[]>([]);
  useEffect(() => {
    void appel<{ activite_recente: { libelle: string; date_metier: string }[] }>(
      `/preview/dossiers/${objet.point_consommation_id}`,
    ).then((d) => setHistorique(d.activite_recente.filter((a) => a.libelle.includes('contrat'))));
  }, [objet]);
  return (
    <article aria-label="Fiche Contrat d’abonnement">
      <h2>{objet.reference}</h2>
      <dl className="fiche">
        <div>
          <dt>État</dt>
          <dd>{objet.statut}</dd>
        </div>
        <div>
          <dt>Nature</dt>
          <dd>{objet.nature_abonnement}</dd>
        </div>
        <div>
          <dt>Date d’effet</dt>
          <dd>{objet.date_effet}</dd>
        </div>
      </dl>
      {objet.statut === 'BROUILLON' && (
        <>
          <label>
            Titulaire principal
            <SelecteurTiers valeur={tiers} onChange={setTiers} requis />
          </label>
          <button
            disabled={!tiers}
            onClick={() =>
              void commande(`/contrats-abonnement/${objet.id}/participants`, {
                identifiant_tiers: tiers,
                role_contractuel: 'TITULAIRE_PRINCIPAL',
                responsabilite_financiere: true,
                date_debut_validite: new Date().toISOString().slice(0, 10),
              })
            }
          >
            Ajouter le titulaire principal
          </button>
          <button
            onClick={() =>
              void commande<Contrat>(
                `/contrats-abonnement/${objet.id}/valider`,
                { motif: 'validation' },
                objet.version,
              ).then(onChange)
            }
          >
            Valider
          </button>
        </>
      )}
      {objet.statut === 'VALIDE' && (
        <button
          onClick={() =>
            void commande<Contrat>(
              `/contrats-abonnement/${objet.id}/activer`,
              { motif: 'activation' },
              objet.version,
            ).then(onChange)
          }
        >
          Activer
        </button>
      )}
      <h3>Historique des états</h3>
      <ol>
        {historique.map((h, i) => (
          <li key={`${h.date_metier}-${i}`}>
            {new Date(h.date_metier).toLocaleString('fr-FR')} · {h.libelle}
          </li>
        ))}
      </ol>
    </article>
  );
}
export function GestionContrats() {
  const { memoriser } = useParcours();
  const [liste, setListe] = useState<Contrat[]>([]),
    [selection, setSelection] = useState<Contrat>(),
    [point, setPoint] = useState('');
  const charger = () =>
    appel<Page<Contrat>>('/contrats-abonnement').then((r) => setListe(r.resultats));
  useEffect(() => {
    void charger();
  }, []);
  const creer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    void commande<Contrat>('/contrats-abonnement', {
      identifiant_point_consommation: point,
      nature_abonnement: 'EAU_POTABLE',
      date_demande: new Date().toISOString().slice(0, 10),
      date_effet_souhaitee: d.get('effet'),
    }).then((v) => {
      setSelection(v);
      memoriser('contrat', v.id);
      void charger();
    });
  };
  return (
    <section className="colonnes">
      <div>
        <h2>Contrats</h2>
        <ul className="cartes">
          {liste.map((v) => (
            <li key={v.id}>
              <button onClick={() => setSelection(v)}>
                <strong>{v.reference}</strong>
                <span>{v.statut}</span>
              </button>
            </li>
          ))}
        </ul>
        <form className="formulaire" onSubmit={creer}>
          <SelecteurPointConsommation valeur={point} onChange={setPoint} requis />
          <input name="effet" type="date" required />
          <button>Créer</button>
        </form>
      </div>
      {selection && (
        <FicheContratAbonnement
          objet={selection}
          onChange={(v) => {
            setSelection(v);
            void charger();
          }}
        />
      )}
    </section>
  );
}

export function FicheCompteur({
  objet,
  onChange,
}: {
  objet: Compteur;
  onChange: (v: Compteur) => void;
}) {
  const [point, setPoint] = useState(''),
    [affectation, setAffectation] = useState<Affectation>();
  const poser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    void commande<Affectation>(
      `/compteurs/${objet.id}/poser`,
      {
        identifiant_point_consommation: point,
        date_pose: new Date(String(d.get('date'))).toISOString(),
        index_pose: Number(d.get('index')),
        reference_intervention: d.get('intervention'),
      },
      objet.version,
    ).then((v) => {
      setAffectation(v);
      onChange({ ...objet, statut: 'POSE', version: objet.version + 1 });
    });
  };
  return (
    <article aria-label="Fiche Compteur">
      <h2>{objet.numero_serie}</h2>
      <dl className="fiche">
        <div>
          <dt>État</dt>
          <dd>{objet.statut}</dd>
        </div>
        <div>
          <dt>Fabricant</dt>
          <dd>{objet.fabricant}</dd>
        </div>
        <div>
          <dt>Modèle</dt>
          <dd>{objet.modele ?? '—'}</dd>
        </div>
      </dl>
      {objet.statut === 'DISPONIBLE' && (
        <form className="formulaire" onSubmit={poser}>
          <label>
            Point courant
            <SelecteurPointConsommation valeur={point} onChange={setPoint} requis />
          </label>
          <label>
            Date de pose
            <input name="date" type="datetime-local" required />
          </label>
          <label>
            Index de pose
            <input name="index" type="number" min="0" required />
          </label>
          <label>
            Référence d’intervention
            <input name="intervention" required />
          </label>
          <button>Poser</button>
        </form>
      )}
      {affectation && (
        <dl className="fiche">
          <div>
            <dt>Affectation active</dt>
            <dd>{affectation.id}</dd>
          </div>
          <div>
            <dt>Point courant</dt>
            <dd>{affectation.point_consommation_id}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
export function GestionCompteurs() {
  const { memoriser } = useParcours();
  const [liste, setListe] = useState<Compteur[]>([]),
    [selection, setSelection] = useState<Compteur>();
  const charger = () => appel<Page<Compteur>>('/compteurs').then((r) => setListe(r.resultats));
  useEffect(() => {
    void charger();
  }, []);
  const creer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    void commande<Compteur>('/compteurs', {
      numero_serie: d.get('serie'),
      fabricant: d.get('fabricant'),
      modele: d.get('modele'),
      calibre: d.get('calibre'),
    }).then((v) => {
      setSelection(v);
      memoriser('compteur', v.id);
      void charger();
    });
  };
  return (
    <section className="colonnes">
      <div>
        <h2>Compteurs</h2>
        <ul className="cartes">
          {liste.map((v) => (
            <li key={v.id}>
              <button onClick={() => setSelection(v)}>
                <strong>{v.numero_serie}</strong>
                <span>{v.statut}</span>
              </button>
            </li>
          ))}
        </ul>
        <form className="formulaire" onSubmit={creer}>
          <input name="serie" placeholder="Numéro de série" required />
          <input name="fabricant" placeholder="Fabricant" required />
          <input name="modele" placeholder="Modèle" />
          <input name="calibre" placeholder="Calibre" required />
          <button>Enregistrer</button>
        </form>
      </div>
      {selection && (
        <FicheCompteur
          objet={selection}
          onChange={(v) => {
            setSelection(v);
            void charger();
          }}
        />
      )}
    </section>
  );
}
