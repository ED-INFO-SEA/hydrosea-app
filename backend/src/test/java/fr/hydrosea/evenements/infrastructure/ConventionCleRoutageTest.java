package fr.hydrosea.evenements.infrastructure;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

class ConventionCleRoutageTest {
  @Test
  void construit_la_cle_depuis_l_agregat_reel() {
    assertEquals("tiers.tiers_cree", ConventionCleRoutage.depuis("TIERS", "TIERS_CREE"));
    assertEquals("contrat.contrat_valide",
        ConventionCleRoutage.depuis("CONTRAT", "CONTRAT_VALIDE"));
    assertEquals("compteur.compteur_enregistre",
        ConventionCleRoutage.depuis("COMPTEUR", "COMPTEUR_ENREGISTRE"));
    assertEquals("nouvel_agregat.nouvel_evenement",
        ConventionCleRoutage.depuis("NOUVEL_AGREGAT", "NOUVEL_EVENEMENT"));
    assertNotEquals("tiers.contrat_valide",
        ConventionCleRoutage.depuis("CONTRAT", "CONTRAT_VALIDE"));
  }
}
