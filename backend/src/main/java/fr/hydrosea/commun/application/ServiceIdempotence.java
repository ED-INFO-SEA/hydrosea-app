package fr.hydrosea.commun.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class ServiceIdempotence {
  private final JdbcTemplate jdbc;
  private final ObjectMapper json;
  private final Duration retention;
  private final TransactionTemplate transactions;

  public ServiceIdempotence(JdbcTemplate jdbc, ObjectMapper json, MeterRegistry registre,
      TransactionTemplate transactions, @Value("${hydrosea.idempotence.retention}") Duration retention) {
    this.jdbc = jdbc;
    this.json = json;
    this.transactions = transactions;
    this.retention = retention;
    registre.gauge("hydrosea.idempotence.cles", jdbc, j -> Optional.ofNullable(j.queryForObject(
        "SELECT count(*) FROM app.idempotence WHERE date_expiration>now()", Long.class)).orElse(0L));
  }

  public <T> Resultat<T> executer(String identifiantClient, String cle, String operation, String uri,
      Object requete, Class<T> type, Supplier<ResponseEntity<T>> action) {
    verifierPortee(identifiantClient, cle, operation, uri);
    String empreinte = empreinte(requete);
    try {
      return transactions.execute(statut -> executerSousVerrou(
          identifiantClient, cle, operation, uri, empreinte, type, action));
    } catch (EchecAction exception) {
      memoriserEchec(identifiantClient, cle, operation, uri, empreinte);
      throw exception.cause;
    }
  }

  private <T> Resultat<T> executerSousVerrou(String client, String cle, String operation, String uri,
      String empreinte, Class<T> type, Supplier<ResponseEntity<T>> action) {
    String portee = client + '\u001f' + operation + '\u001f' + uri + '\u001f' + cle;
    jdbc.query("SELECT pg_advisory_xact_lock(hashtextextended(?,0))",
        (org.springframework.jdbc.core.RowCallbackHandler) rs -> {}, portee);
    Memoire memoire = trouver(client, cle, operation, uri);
    if (memoire != null && memoire.dateExpiration().isAfter(Instant.now()) && "TERMINE".equals(memoire.etat())) {
      if (!memoire.empreinte().equals(empreinte)) throw new ConflitIdempotenceException();
      return rejouer(memoire, type);
    }
    if (memoire != null && !memoire.empreinte().equals(empreinte) && memoire.dateExpiration().isAfter(Instant.now())) {
      throw new ConflitIdempotenceException();
    }
    reserver(client, cle, operation, uri, empreinte);
    ResponseEntity<T> reponse;
    try { reponse = action.get(); }
    catch (RuntimeException exception) { throw new EchecAction(exception); }
    Map<String, List<String>> enTetes = Map.copyOf(reponse.getHeaders());
    UUID correlation = correlation(enTetes);
    try {
      jdbc.update("""
          UPDATE app.idempotence SET etat='TERMINE',reponse=?::jsonb,statut_http=?,en_tetes_reponse=?::jsonb,
          correlation_id=?,date_fin_traitement=now(),date_expiration=?
          WHERE identifiant_client=? AND operation=? AND uri=? AND cle=?
          """, json.writeValueAsString(reponse.getBody()), reponse.getStatusCode().value(),
          json.writeValueAsString(enTetes), correlation, Timestamp.from(Instant.now().plus(retention)),
          client, operation, uri, cle);
    } catch (JsonProcessingException exception) {
      throw new IllegalStateException("Réponse non sérialisable.", exception);
    }
    return new Resultat<>(reponse.getBody(), reponse.getStatusCode(), enTetes, correlation, false);
  }

  private void reserver(String client, String cle, String operation, String uri, String empreinte) {
    jdbc.update("""
        INSERT INTO app.idempotence(identifiant_client,cle,operation,uri,empreinte_requete,etat,date_expiration,correlation_id)
        VALUES (?,?,?,?,?,'EN_COURS',?,?)
        ON CONFLICT (identifiant_client,operation,uri,cle) DO UPDATE SET
          empreinte_requete=excluded.empreinte_requete,etat='EN_COURS',reponse=NULL,statut_http=NULL,
          en_tetes_reponse=NULL,date_fin_traitement=NULL,date_expiration=excluded.date_expiration,
          correlation_id=excluded.correlation_id
        """, client, cle, operation, uri, empreinte, Timestamp.from(Instant.now().plus(retention)), UUID.randomUUID());
  }

  private void memoriserEchec(String client, String cle, String operation, String uri, String empreinte) {
    try {
      transactions.executeWithoutResult(statut -> jdbc.update("""
          INSERT INTO app.idempotence(identifiant_client,cle,operation,uri,empreinte_requete,etat,date_expiration,correlation_id,date_fin_traitement)
          VALUES (?,?,?,?,?,'ECHEC',?,?,now())
          ON CONFLICT (identifiant_client,operation,uri,cle) DO UPDATE SET etat='ECHEC',date_fin_traitement=now()
          WHERE app.idempotence.etat<>'TERMINE' AND app.idempotence.empreinte_requete=excluded.empreinte_requete
          """, client, cle, operation, uri, empreinte, Timestamp.from(Instant.now().plus(retention)), UUID.randomUUID()));
    } catch (RuntimeException ignoree) {
      // L’échec métier initial reste prioritaire ; un prochain appel réservera de nouveau la portée.
    }
  }

  private Memoire trouver(String client, String cle, String operation, String uri) {
    return jdbc.query("""
        SELECT empreinte_requete,reponse::text,statut_http,en_tetes_reponse::text,correlation_id,etat,date_expiration
        FROM app.idempotence WHERE identifiant_client=? AND operation=? AND uri=? AND cle=?
        """, (rs, n) -> new Memoire(rs.getString(1), rs.getString(2), (Integer) rs.getObject(3),
            rs.getString(4), rs.getObject(5, UUID.class), rs.getString(6), rs.getTimestamp(7).toInstant()),
        client, operation, uri, cle).stream().findFirst().orElse(null);
  }

  private <T> Resultat<T> rejouer(Memoire memoire, Class<T> type) {
    try {
      T corps = "null".equals(memoire.reponse()) ? null : json.readValue(memoire.reponse(), type);
      Map<String, List<String>> enTetes = json.readValue(memoire.enTetes(), new TypeReference<>() {});
      return new Resultat<>(corps, HttpStatusCode.valueOf(memoire.statut()), enTetes, memoire.correlation(), true);
    } catch (JsonProcessingException exception) {
      throw new IllegalStateException("Réponse idempotente illisible.", exception);
    }
  }

  private static UUID correlation(Map<String, List<String>> enTetes) {
    List<String> valeurs = enTetes.getOrDefault("X-Correlation-Id", List.of());
    return valeurs.isEmpty() ? UUID.randomUUID() : UUID.fromString(valeurs.getFirst());
  }

  private static void verifierPortee(String client, String cle, String operation, String uri) {
    if (client == null || client.isBlank()) throw new IllegalArgumentException("Le sujet authentifié est obligatoire.");
    if (cle == null || cle.length() < 8 || cle.length() > 128) {
      throw new IllegalArgumentException("Idempotency-Key est obligatoire (8 à 128 caractères).");
    }
    if (operation == null || operation.isBlank() || uri == null || !uri.startsWith("/")) {
      throw new IllegalArgumentException("La portée d’idempotence est incomplète.");
    }
  }

  @Scheduled(cron = "${hydrosea.idempotence.nettoyage:0 15 * * * *}")
  public void nettoyer() { jdbc.update("DELETE FROM app.idempotence WHERE date_expiration<now()"); }

  private String empreinte(Object valeur) {
    try {
      return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(json.writeValueAsBytes(valeur)));
    } catch (NoSuchAlgorithmException | JsonProcessingException exception) {
      throw new IllegalStateException(exception);
    }
  }

  public record Resultat<T>(T corps, HttpStatusCode statut, Map<String, List<String>> enTetes,
                            UUID correlation, boolean rejoue) {
    public ResponseEntity<T> enReponseHttp() {
      HttpHeaders entetesHttp = new HttpHeaders();
      enTetes.forEach(entetesHttp::put);
      return new ResponseEntity<>(corps, entetesHttp, statut);
    }
  }

  private record Memoire(String empreinte, String reponse, Integer statut, String enTetes,
                         UUID correlation, String etat, Instant dateExpiration) {}
  private static final class EchecAction extends RuntimeException {
    private final RuntimeException cause;
    private EchecAction(RuntimeException cause) { super(cause); this.cause = cause; }
  }
}
