package fr.hydrosea.tiers.domaine;

import java.time.LocalDate;

public record PersonnePhysique(String nom, String nomUsage, String prenoms, LocalDate dateNaissance) {
  public PersonnePhysique {
    if (nom == null || nom.isBlank() || prenoms == null || prenoms.isBlank()) {
      throw new IllegalArgumentException("Le nom et les prénoms sont obligatoires.");
    }
  }
}

