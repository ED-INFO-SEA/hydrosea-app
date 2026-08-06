package fr.hydrosea.tiers.interfaceapi;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;

class ValidationModificationTiersTest {
  private final jakarta.validation.Validator validateur =
      Validation.buildDefaultValidatorFactory().getValidator();

  @Test void refuse_un_patch_vide() {
    assertThat(validateur.validate(new ModelesApiTiers.ModifierTiers(null, null))).isNotEmpty();
  }

  @Test void refuse_les_deux_specialisations_dans_un_patch() {
    var physique = new ModelesApiTiers.PersonnePhysiqueCommande("Martin", null, "Camille", null);
    var morale = new ModelesApiTiers.PersonneMoraleCommande("Atelier", null, "SAS");
    assertThat(validateur.validate(new ModelesApiTiers.ModifierTiers(physique, morale))).isNotEmpty();
  }
}
