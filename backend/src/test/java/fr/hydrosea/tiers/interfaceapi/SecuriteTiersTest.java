package fr.hydrosea.tiers.interfaceapi;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import fr.hydrosea.administration.infrastructure.ConfigurationSecurite;
import fr.hydrosea.commun.application.ServiceIdempotence;
import fr.hydrosea.tiers.application.ServiceTiers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ControleurTiers.class)
@Import(ConfigurationSecurite.class)
class SecuriteTiersTest {
  @Autowired MockMvc mvc;
  @MockitoBean ServiceTiers service;
  @MockitoBean ServiceIdempotence idempotence;
  @Test void exige_authentification() throws Exception { mvc.perform(get("/v1/tiers")).andExpect(status().isUnauthorized()); }
  @Test void refuse_sans_portee() throws Exception { mvc.perform(get("/v1/tiers").with(jwt())).andExpect(status().isForbidden()); }
  @Test void autorise_lecture_avec_portee() throws Exception {
    when(service.rechercher(isNull(),isNull(),isNull(),isNull(),anyInt(),anyInt(),anyString(),
        anyString())).thenReturn(Page.empty());
    mvc.perform(get("/v1/tiers").with(jwt().authorities(new SimpleGrantedAuthority("SCOPE_tiers:lecture")))).andExpect(status().isOk());
  }
}
