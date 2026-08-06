package fr.hydrosea.tiers.domaine;

import java.time.Instant;
import java.util.UUID;

public record Tiers(UUID identifiant, String reference, CategorieTiers categorie, StatutTiers statut,
                    PersonnePhysique personnePhysique, PersonneMorale personneMorale,
                    int version, Instant dateCreation, Instant dateModification) {
  public Tiers {
    boolean physique = personnePhysique != null;
    boolean morale = personneMorale != null;
    if (physique == morale || (physique && categorie != CategorieTiers.PERSONNE_PHYSIQUE)
        || (morale && categorie != CategorieTiers.PERSONNE_MORALE)) {
      throw new IllegalArgumentException("Un Tiers possède exactement une spécialisation conforme à sa catégorie.");
    }
  }

  public Tiers archiver() {
    if (statut == StatutTiers.ARCHIVE) return this;
    return new Tiers(identifiant, reference, categorie, StatutTiers.ARCHIVE,
        personnePhysique, personneMorale, version, dateCreation, dateModification);
  }
}

