import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type ResultatsParcours = {
  tiers?: string;
  pointDesserte?: string;
  pointConsommation?: string;
  contrat?: string;
  compteur?: string;
};
type Valeur = {
  resultats: ResultatsParcours;
  memoriser: (nom: keyof ResultatsParcours, id: string) => void;
};
const Contexte = createContext<Valeur | undefined>(undefined);
export function FournisseurParcours({ children }: { children: ReactNode }) {
  const [resultats, setResultats] = useState<ResultatsParcours>(
    () => JSON.parse(localStorage.getItem('hydrosea-parcours') ?? '{}') as ResultatsParcours,
  );
  const valeur = useMemo(
    () => ({
      resultats,
      memoriser: (nom: keyof ResultatsParcours, id: string) =>
        setResultats((courants) => {
          const suivants = { ...courants, [nom]: id };
          localStorage.setItem('hydrosea-parcours', JSON.stringify(suivants));
          return suivants;
        }),
    }),
    [resultats],
  );
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useParcours() {
  const valeur = useContext(Contexte);
  if (!valeur) throw new Error('FournisseurParcours absent.');
  return valeur;
}
