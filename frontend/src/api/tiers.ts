import type { CreerTiers, ModifierTiers, PageTiers, Tiers } from './genere';
import { TiersService } from './genere';

const correlation = () => crypto.randomUUID();
const idempotence = () => crypto.randomUUID();

export const apiTiers = {
  rechercher(recherche = ''): Promise<PageTiers> {
    return TiersService.rechercherTiers({ recherche, xCorrelationId: correlation() } as never);
  },
  consulter(identifiant: string): Promise<Tiers> {
    return TiersService.consulterTiers({
      identifiantTiers: identifiant,
      xCorrelationId: correlation(),
    });
  },
  creer(requete: CreerTiers): Promise<Tiers> {
    return TiersService.creerTiers({
      requestBody: requete,
      idempotencyKey: idempotence(),
      xCorrelationId: correlation(),
    });
  },
  modifier(tiers: Tiers, requete: ModifierTiers): Promise<Tiers> {
    return TiersService.modifierTiers({
      identifiantTiers: tiers.identifiant_tiers,
      ifMatch: `"${tiers.version}"`,
      requestBody: requete,
      xCorrelationId: correlation(),
    });
  },
  archiver(tiers: Tiers, motif: string): Promise<Tiers> {
    return TiersService.archiverTiers({
      identifiantTiers: tiers.identifiant_tiers,
      ifMatch: `"${tiers.version}"`,
      idempotencyKey: idempotence(),
      requestBody: { motif },
      xCorrelationId: correlation(),
    });
  },
};
