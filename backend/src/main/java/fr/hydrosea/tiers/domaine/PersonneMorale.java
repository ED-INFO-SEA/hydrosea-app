package fr.hydrosea.tiers.domaine;

public record PersonneMorale(String raisonSociale, String siret, String formeJuridique) {
  public PersonneMorale {
    if (raisonSociale == null || raisonSociale.isBlank()) {
      throw new IllegalArgumentException("La raison sociale est obligatoire.");
    }
    if (siret != null && !siret.matches("[0-9]{14}")) {
      throw new IllegalArgumentException("Le SIRET doit comporter quatorze chiffres.");
    }
  }
}

