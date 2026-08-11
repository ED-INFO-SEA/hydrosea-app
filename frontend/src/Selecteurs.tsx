import { useEffect, useMemo, useState } from 'react';
import { keycloak } from './authentification';

type ElementMetier = { id: string; reference: string; libelle: string; statut: string };
type Props = {
  valeur?: string;
  onChange: (id: string, element?: ElementMetier) => void;
  exclure?: string;
  requis?: boolean;
};
const charger = async (chemin: string) => {
  const r = await fetch(`/api/v1${chemin}`, {
    headers: { Authorization: `Bearer ${keycloak.token}` },
  });
  if (!r.ok) throw new Error('Sélection indisponible');
  return r.json();
};
function Selecteur({
  titre,
  chemin,
  convertir,
  ...props
}: Props & {
  titre: string;
  chemin: string;
  convertir: (o: Record<string, unknown>) => ElementMetier;
}) {
  const [elements, setElements] = useState<ElementMetier[]>([]);
  const [recherche, setRecherche] = useState('');
  useEffect(() => {
    void charger(chemin).then((v) =>
      setElements(((v.resultats ?? v) as Record<string, unknown>[]).map(convertir)),
    );
  }, [chemin]); // eslint-disable-line react-hooks/exhaustive-deps
  const filtres = useMemo(
    () =>
      elements.filter(
        (e) =>
          e.id !== props.exclure &&
          `${e.reference} ${e.libelle} ${e.statut}`.toLowerCase().includes(recherche.toLowerCase()),
      ),
    [elements, recherche, props.exclure],
  );
  return (
    <fieldset className="selecteur">
      <legend>{titre}</legend>
      <label>
        Rechercher
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Référence ou libellé"
        />
      </label>
      <label>
        Sélection
        <select
          required={props.requis}
          value={props.valeur ?? ''}
          onChange={(e) =>
            props.onChange(
              e.target.value,
              elements.find((x) => x.id === e.target.value),
            )
          }
        >
          <option value="">Choisir…</option>
          {filtres.map((e) => (
            <option key={e.id} value={e.id}>
              {e.reference} · {e.libelle} · {e.statut}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}
const texte = (v: unknown) => String(v ?? '');
export const SelecteurTiers = (p: Props) => (
  <Selecteur
    {...p}
    titre="Tiers"
    chemin="/tiers?taille_page=100"
    convertir={(o) => ({
      id: texte(o.identifiant_tiers),
      reference: texte(o.reference),
      libelle: texte(
        (o.personne_physique as Record<string, unknown>)?.nom ??
          (o.personne_morale as Record<string, unknown>)?.raison_sociale,
      ),
      statut: texte(o.statut),
    })}
  />
);
export const SelecteurAdresse = (p: Props) => (
  <Selecteur
    {...p}
    titre="Adresse"
    chemin="/preview/adresses"
    convertir={(o) => ({
      id: texte(o.identifiant),
      reference: texte(o.code_postal),
      libelle: texte(o.libelle),
      statut: texte(o.commune),
    })}
  />
);
export const SelecteurPointDesserte = (p: Props) => (
  <Selecteur
    {...p}
    titre="Point de desserte"
    chemin="/points-desserte"
    convertir={(o) => ({
      id: texte(o.id),
      reference: texte(o.reference),
      libelle: 'Desserte',
      statut: texte(o.statut),
    })}
  />
);
export const SelecteurPointConsommation = (p: Props) => (
  <Selecteur
    {...p}
    titre="Point de consommation"
    chemin="/points-consommation"
    convertir={(o) => ({
      id: texte(o.id),
      reference: texte(o.reference),
      libelle: texte(o.usage),
      statut: texte(o.statut),
    })}
  />
);
export const SelecteurCompteur = (p: Props) => (
  <Selecteur
    {...p}
    titre="Compteur"
    chemin="/compteurs"
    convertir={(o) => ({
      id: texte(o.id),
      reference: texte(o.numero_serie),
      libelle: `${texte(o.fabricant)} ${texte(o.modele)}`,
      statut: texte(o.statut),
    })}
  />
);
