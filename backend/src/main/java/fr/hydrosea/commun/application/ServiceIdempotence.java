package fr.hydrosea.commun.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceIdempotence {
  private final JdbcTemplate jdbc; private final ObjectMapper json; private final Duration retention;
  public ServiceIdempotence(JdbcTemplate jdbc, ObjectMapper json, MeterRegistry registre,
      @Value("${hydrosea.idempotence.retention}") Duration retention) {
    this.jdbc=jdbc; this.json=json; this.retention=retention;
    registre.gauge("hydrosea.idempotence.cles", jdbc, j -> Optional.ofNullable(j.queryForObject("SELECT count(*) FROM app.idempotence WHERE expire_le>now()", Long.class)).orElse(0L));
  }
  @Transactional
  public <T> Resultat<T> executer(String cle, String operation, String uri, Object requete,
      UUID correlation, Class<T> type, HttpStatus statut, Supplier<T> action) {
    if (cle == null || cle.length() < 8 || cle.length() > 128) throw new IllegalArgumentException("Idempotency-Key est obligatoire (8 à 128 caractères).");
    String empreinte = empreinte(requete);
    var trouve = jdbc.query("SELECT empreinte_requete,reponse::text,statut_http,correlation_id FROM app.idempotence WHERE cle=? AND operation=? AND expire_le>now()",
        (rs,n) -> new Memoire(rs.getString(1),rs.getString(2),rs.getInt(3),rs.getObject(4,UUID.class)), cle, operation);
    if (!trouve.isEmpty()) {
      Memoire memoire = trouve.getFirst();
      if (!memoire.empreinte.equals(empreinte)) throw new ConflitIdempotenceException();
      try { return new Resultat<>(json.readValue(memoire.reponse, type), HttpStatus.valueOf(memoire.statut), memoire.correlation, true); }
      catch (JsonProcessingException exception) { throw new IllegalStateException("Réponse idempotente illisible.", exception); }
    }
    T resultat = action.get();
    try {
      jdbc.update("INSERT INTO app.idempotence(cle,operation,uri,empreinte_requete,reponse,statut_http,expire_le,correlation_id) VALUES (?,?,?,?,?::jsonb,?,?,?)",
          cle,operation,uri,empreinte,json.writeValueAsString(resultat),statut.value(),java.sql.Timestamp.from(Instant.now().plus(retention)),correlation);
    } catch (JsonProcessingException exception) { throw new IllegalStateException("Réponse non sérialisable.", exception); }
    return new Resultat<>(resultat, statut, correlation, false);
  }
  @Scheduled(cron="${hydrosea.idempotence.nettoyage:0 15 * * * *}") public void nettoyer() { jdbc.update("DELETE FROM app.idempotence WHERE expire_le<now()"); }
  private String empreinte(Object valeur) {
    try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(json.writeValueAsBytes(valeur))); }
    catch (NoSuchAlgorithmException | JsonProcessingException exception) { throw new IllegalStateException(exception); }
  }
  public record Resultat<T>(T corps,HttpStatus statut,UUID correlation,boolean rejoue) {}
  private record Memoire(String empreinte,String reponse,int statut,UUID correlation) {}
}
