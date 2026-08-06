package fr.hydrosea.tiers.application;

import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;

public final class CommandesTiers {
  private CommandesTiers() {}
  public record Creer(String categorie, PersonnePhysique personnePhysique, PersonneMorale personneMorale) {}
  public record Modifier(PersonnePhysique personnePhysique, PersonneMorale personneMorale) {}
}
