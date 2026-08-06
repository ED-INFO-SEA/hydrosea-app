package fr.hydrosea.evenements.infrastructure;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.hydrosea.evenements.application.PortEvenements;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdaptateurBoiteEnvoi implements PortEvenements {
  private final JdbcTemplate jdbc;
  private final ObjectMapper json;
  private final RabbitTemplate rabbit;
  private final String echange;
  private final Counter succes;
  private final Counter echecs;

  public AdaptateurBoiteEnvoi(JdbcTemplate jdbc, ObjectMapper json, RabbitTemplate rabbit,
      MeterRegistry metriques, @Value("${hydrosea.evenements.echange}") String echange) {
    this.jdbc = jdbc; this.json = json; this.rabbit = rabbit; this.echange = echange;
    this.succes = metriques.counter("hydrosea.boite_envoi.publications", "resultat", "succes");
    this.echecs = metriques.counter("hydrosea.boite_envoi.publications", "resultat", "echec");
  }

  @Override
  public void enregistrer(String type, String typeAgregat, UUID agregat, UUID correlation, Map<String, Object> charge) {
    UUID evenement = UUID.randomUUID();
    jdbc.update("INSERT INTO evt.evenement_metier(id,type_evenement,type_agregat,agregat_id,date_metier,source,correlation_id,charge) VALUES (?,?,?,?,?,'hydrosea-app',?,?::jsonb)",
        evenement, type, typeAgregat, agregat, java.sql.Timestamp.from(Instant.now()), correlation, serialiser(charge));
    jdbc.update("INSERT INTO evt.boite_envoi(evenement_metier_id) VALUES (?)", evenement);
  }

  @Scheduled(fixedDelayString = "${hydrosea.evenements.delai-publication:1000}")
  @Transactional
  public void publier() {
    List<MessageSortant> messages = jdbc.query("""
        SELECT b.id,e.type_evenement,e.correlation_id,e.charge::text FROM evt.boite_envoi b
        JOIN evt.evenement_metier e ON e.id=b.evenement_metier_id
        WHERE b.statut='A_PUBLIER' AND b.disponible_le<=now() ORDER BY b.disponible_le
        FOR UPDATE OF b SKIP LOCKED LIMIT 20
        """, (rs, n) -> new MessageSortant(rs.getObject(1, UUID.class), rs.getString(2),
            rs.getObject(3, UUID.class), rs.getString(4)));
    for (MessageSortant message : messages) {
      try {
        rabbit.convertAndSend(echange, "tiers." + message.type.toLowerCase(), message.charge, m -> {
          m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
          m.getMessageProperties().setCorrelationId(message.correlation.toString());
          m.getMessageProperties().setMessageId(message.id.toString());
          m.getMessageProperties().setContentType("application/json");
          return m;
        });
        jdbc.update("UPDATE evt.boite_envoi SET statut='PUBLIE',publie_le=now(),tentatives=tentatives+1,erreur=NULL WHERE id=?", message.id);
        succes.increment();
      } catch (RuntimeException exception) {
        jdbc.update("UPDATE evt.boite_envoi SET tentatives=tentatives+1,disponible_le=now()+interval '1 minute',statut=CASE WHEN tentatives>=4 THEN 'ERREUR' ELSE 'A_PUBLIER' END,erreur=? WHERE id=?",
            exception.getClass().getSimpleName(), message.id);
        echecs.increment();
      }
    }
  }

  private String serialiser(Object valeur) {
    try { return json.writeValueAsString(valeur); }
    catch (JsonProcessingException exception) { throw new IllegalArgumentException("Événement non sérialisable.", exception); }
  }
  private record MessageSortant(UUID id, String type, UUID correlation, String charge) {}
}

