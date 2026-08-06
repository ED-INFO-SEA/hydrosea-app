package fr.hydrosea.tiers.application;

import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;

public record CommandeModifierTiers(PersonnePhysique personnePhysique, PersonneMorale personneMorale) {
  public CommandeModifierTiers {
    if ((personnePhysique == null) == (personneMorale == null)) {
      throw new IllegalArgumentException("Une et une seule spécialisation complète doit être fournie.");
    }
  }
}
