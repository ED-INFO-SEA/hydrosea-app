package fr.hydrosea.comptage.infrastructure;

import fr.hydrosea.commun.application.RegleMetierException;
import fr.hydrosea.commun.application.VersionObsoleteException;
import fr.hydrosea.comptage.application.ModelesComptage.CommandeCreerCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandeModifierCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandePoserCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.VueAffectation;
import fr.hydrosea.comptage.application.ModelesComptage.VueCompteur;
import fr.hydrosea.comptage.application.PortComptage;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdaptateurJdbcComptage implements PortComptage {
  private final JdbcTemplate jdbc;
  private static final org.springframework.jdbc.core.RowMapper<VueCompteur> COMPTEUR =
      (r, n) -> new VueCompteur(r.getObject("id", UUID.class), r.getString("numero_serie"),
          r.getString("fabricant"), r.getString("modele"), r.getString("calibre"),
          r.getString("statut"), r.getInt("version"));
  private static final org.springframework.jdbc.core.RowMapper<VueAffectation> AFFECTATION =
      (r, n) -> new VueAffectation(r.getObject("id", UUID.class),
          r.getObject("compteur_id", UUID.class), r.getObject("point_consommation_id", UUID.class),
          r.getObject("index_pose", BigDecimal.class), r.getString("reference_intervention"));

  public AdaptateurJdbcComptage(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  public List<VueCompteur> listerCompteurs() {
    return jdbc.query("SELECT id,numero_serie,fabricant,modele,calibre,statut,version "
        + "FROM cpt.compteur WHERE date_suppression IS NULL ORDER BY date_creation DESC LIMIT 100",
        COMPTEUR);
  }

  public VueCompteur obtenirCompteur(UUID id) {
    return jdbc.queryForObject("SELECT id,numero_serie,fabricant,modele,calibre,statut,version "
        + "FROM cpt.compteur WHERE id=?", COMPTEUR, id);
  }

  public VueCompteur creer(UUID id, CommandeCreerCompteur commande) {
    jdbc.update("INSERT INTO cpt.compteur(id,numero_serie,fabricant,modele,calibre) "
        + "VALUES (?,?,?,?,?)", id, commande.numeroSerie().strip().toUpperCase(),
        commande.fabricant(), commande.modele(), commande.calibre());
    return obtenirCompteur(id);
  }

  public VueCompteur modifier(UUID id, int version, CommandeModifierCompteur commande) {
    int lignes = jdbc.update("UPDATE cpt.compteur SET fabricant=COALESCE(?,fabricant),"
        + "modele=COALESCE(?,modele),calibre=COALESCE(?,calibre),version=version+1,"
        + "date_modification=now() WHERE id=? AND version=?", commande.fabricant(),
        commande.modele(), commande.calibre(), id, version);
    if (lignes == 0) throw new VersionObsoleteException();
    return obtenirCompteur(id);
  }

  public VueAffectation poser(UUID id, int version, CommandePoserCompteur commande) {
    Integer nombre = jdbc.queryForObject("SELECT count(*) FROM des.point_consommation WHERE id=?",
        Integer.class, commande.point());
    if (nombre == null || nombre == 0) throw new RegleMetierException("Point de consommation absent.");
    int lignes = jdbc.update("UPDATE cpt.compteur SET statut='POSE',version=version+1 "
        + "WHERE id=? AND version=? AND statut='DISPONIBLE'", id, version);
    if (lignes == 0) throw new VersionObsoleteException();
    UUID affectation = UUID.randomUUID();
    jdbc.update("INSERT INTO cpt.affectation_compteur(id,compteur_id,point_consommation_id,"
        + "periode,index_pose,reference_intervention) VALUES (?,?,?,tstzrange(?,NULL,'[)'),?,?)",
        affectation, id, commande.point(), commande.date(), commande.index(), commande.intervention());
    return obtenirAffectation(affectation);
  }

  public List<VueAffectation> listerAffectations() {
    return jdbc.query("SELECT id,compteur_id,point_consommation_id,index_pose,reference_intervention "
        + "FROM cpt.affectation_compteur WHERE date_suppression IS NULL "
        + "ORDER BY date_creation DESC LIMIT 100", AFFECTATION);
  }

  public VueAffectation obtenirAffectation(UUID id) {
    return jdbc.queryForObject("SELECT id,compteur_id,point_consommation_id,index_pose,"
        + "reference_intervention FROM cpt.affectation_compteur WHERE id=?", AFFECTATION, id);
  }
}
