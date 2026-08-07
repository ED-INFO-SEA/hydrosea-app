package fr.hydrosea.preview.interfaceapi;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.hydrosea.abonnements.application.ServiceAbonnements;
import fr.hydrosea.administration.infrastructure.ConfigurationSecurite;
import fr.hydrosea.commun.application.ServiceIdempotence;
import fr.hydrosea.comptage.application.ServiceComptage;
import fr.hydrosea.desserte.application.ServiceDesserte;
import fr.hydrosea.preview.application.ServiceLecturePreview;
import fr.hydrosea.tiers.application.ServiceTiers;
import fr.hydrosea.tiers.interfaceapi.ControleurTiers;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@WebMvcTest({ControleurPreview.class, ControleurTiers.class})
@Import(ConfigurationSecurite.class)
class SecuriteProfilsPreviewTest {
  @Autowired MockMvc mvc;
  @MockitoBean ServiceTiers tiers;
  @MockitoBean ServiceDesserte desserte;
  @MockitoBean ServiceAbonnements abonnements;
  @MockitoBean ServiceComptage comptage;
  @MockitoBean ServiceLecturePreview lecture;
  @MockitoBean ServiceIdempotence idempotence;

  @BeforeEach
  void preparerLectures() {
    when(tiers.rechercher(null, null, null, null, 1, 20)).thenReturn(Page.empty());
    when(desserte.listerDessertes()).thenReturn(List.of());
    when(abonnements.lister()).thenReturn(List.of());
    when(comptage.lister()).thenReturn(List.of());
  }

  @Test
  void agentRelationUsagersAccedeAuxTiersPointsEtContrats() throws Exception {
    var profil = profil("tiers:lecture", "points:lecture", "contrats:lecture");
    mvc.perform(get("/v1/tiers").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/points-desserte").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/contrats-abonnement").with(profil)).andExpect(status().isOk());
  }

  @Test
  void agentRelationUsagersNePeutPasPoserUnCompteur() throws Exception {
    mvc.perform(post("/v1/compteurs/00000000-0000-0000-0000-000000000001/poser")
        .header("If-Match", "\"1\"").header("Idempotency-Key", "profil-relation")
        .contentType(MediaType.APPLICATION_JSON).content("{}")
        .with(profil("tiers:lecture", "points:lecture", "contrats:lecture")))
        .andExpect(status().isForbidden());
  }

  @Test
  void agentExploitationAccedeAuxPointsEtAuComptage() throws Exception {
    var profil = profil("points:lecture", "comptage:lecture", "comptage:ecriture");
    mvc.perform(get("/v1/points-desserte").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/compteurs").with(profil)).andExpect(status().isOk());
  }

  @Test
  void agentExploitationNePeutPasModifierUnContrat() throws Exception {
    mvc.perform(patch("/v1/contrats-abonnement/00000000-0000-0000-0000-000000000001")
        .header("If-Match", "\"1\"").contentType(MediaType.APPLICATION_JSON).content("{}")
        .with(profil("points:lecture", "comptage:lecture", "comptage:ecriture")))
        .andExpect(status().isForbidden());
  }

  @Test
  void administrateurDemonstrationAccedeAToutLePerimetre() throws Exception {
    var profil = profil("tiers:lecture", "tiers:ecriture", "points:lecture", "points:ecriture",
        "contrats:lecture", "contrats:ecriture", "comptage:lecture", "comptage:ecriture");
    mvc.perform(get("/v1/tiers").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/points-desserte").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/contrats-abonnement").with(profil)).andExpect(status().isOk());
    mvc.perform(get("/v1/compteurs").with(profil)).andExpect(status().isOk());
  }

  private static RequestPostProcessor profil(String... portees) {
    var autorites = java.util.Arrays.stream(portees)
        .<GrantedAuthority>map(portee -> new SimpleGrantedAuthority("SCOPE_" + portee)).toList();
    return jwt().authorities(autorites);
  }
}
