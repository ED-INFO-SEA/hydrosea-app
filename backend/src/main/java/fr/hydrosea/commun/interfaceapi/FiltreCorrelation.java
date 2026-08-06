package fr.hydrosea.commun.interfaceapi;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class FiltreCorrelation extends OncePerRequestFilter {
  public static final String ENTETE = "X-Correlation-Id";
  @Override
  protected void doFilterInternal(HttpServletRequest requete, HttpServletResponse reponse, FilterChain chaine)
      throws ServletException, IOException {
    String fournie = requete.getHeader(ENTETE);
    UUID correlation;
    try { correlation = fournie == null ? UUID.randomUUID() : UUID.fromString(fournie); }
    catch (IllegalArgumentException exception) {
      reponse.sendError(400, "X-Correlation-Id doit être un UUID."); return;
    }
    String valeur = correlation.toString();
    MDC.put("correlation_id", valeur);
    MDC.put("operation", requete.getMethod() + " " + requete.getRequestURI());
    reponse.setHeader(ENTETE, valeur);
    try { chaine.doFilter(requete, reponse); } finally { MDC.clear(); }
  }
  public static UUID courante() {
    String valeur = MDC.get("correlation_id");
    return valeur == null ? UUID.randomUUID() : UUID.fromString(valeur);
  }
}

