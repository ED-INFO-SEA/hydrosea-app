package fr.hydrosea.administration.infrastructure;

import fr.hydrosea.documents.application.PortStockageDocuments;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component("minio")
class SanteMinio implements HealthIndicator {
  private final PortStockageDocuments stockage;
  SanteMinio(PortStockageDocuments stockage) { this.stockage=stockage; }
  public Health health() { return stockage.disponible()?Health.up().build():Health.down().build(); }
}

@Component("boiteEnvoi")
class SanteBoiteEnvoi implements HealthIndicator {
  private final JdbcTemplate jdbc;
  SanteBoiteEnvoi(JdbcTemplate jdbc) { this.jdbc=jdbc; }
  public Health health() {
    Long erreurs=jdbc.queryForObject("SELECT count(*) FROM evt.boite_envoi WHERE statut='ERREUR'",Long.class);
    return erreurs!=null && erreurs>0?Health.down().withDetail("messages_en_erreur",erreurs).build():Health.up().build();
  }
}
