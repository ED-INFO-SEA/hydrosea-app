package fr.hydrosea.commun.interfaceapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.hydrosea.commun.application.RegleMetierException;
import fr.hydrosea.commun.application.VersionObsoleteException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

class GestionnaireErreursApiTest {
  private MockMvc mvc;

  @BeforeEach
  void preparer() {
    mvc = MockMvcBuilders.standaloneSetup(new ControleurErreur())
        .setControllerAdvice(new GestionnaireErreursApi())
        .build();
  }

  @Test
  void structure_toujours_une_regle_metier_en_409() throws Exception {
    mvc.perform(get("/test-erreurs/metier"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("RM-TEST"))
        .andExpect(jsonPath("$.detail").value("Règle explicite."))
        .andExpect(jsonPath("$.statutHttp").value(409));
  }

  @Test
  void applique_le_contrat_canonique_de_version() throws Exception {
    mvc.perform(get("/test-erreurs/version"))
        .andExpect(status().isPreconditionFailed())
        .andExpect(jsonPath("$.code").value("SYS-VERSION-OBSOLETE"))
        .andExpect(jsonPath("$.statutHttp").value(412));
  }

  @Test
  void structure_le_fallback_sans_divulguer_la_cause() throws Exception {
    mvc.perform(get("/test-erreurs/inattendue"))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.code").value("SYS-ERREUR-INTERNE"))
        .andExpect(jsonPath("$.detail").value("La demande n’a pas pu être traitée."))
        .andExpect(jsonPath("$.statutHttp").value(500));
  }

  @RestController
  public static class ControleurErreur {
    @GetMapping("/test-erreurs/metier")
    void metier() { throw new RegleMetierException("RM-TEST", "Règle explicite."); }

    @GetMapping("/test-erreurs/version")
    void version() { throw new VersionObsoleteException(); }

    @GetMapping("/test-erreurs/inattendue")
    void inattendue() { throw new IllegalStateException("Information interne."); }
  }
}
