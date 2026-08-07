package fr.hydrosea.preview.application;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ServiceLecturePreview {
  private final JdbcTemplate jdbc;
  public ServiceLecturePreview(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  public Indicateurs indicateurs() {
    return new Indicateurs(compter("SELECT count(*) FROM ref.tiers WHERE statut='ACTIF'"),
        compter("SELECT count(*) FROM des.point_consommation WHERE statut='OUVERT'"),
        compter("SELECT count(*) FROM abo.contrat_abonnement WHERE statut='ACTIF'"),
        compter("SELECT count(*) FROM cpt.compteur WHERE statut='POSE'"));
  }
  public List<Adresse> adresses() { return jdbc.query("SELECT id,numero,voie,code_postal,commune,lieu_dit FROM ref.adresse WHERE date_suppression IS NULL ORDER BY commune,voie,numero",(rs,n)->new Adresse(rs.getObject(1,UUID.class),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6))); }

  public SyntheseDossier synthese(UUID point) {
    ResumeObjet consommation = objet("SELECT id,reference,statut,usage FROM des.point_consommation WHERE id=?", point);
    ResumeObjet desserte = objetFacultatif("SELECT d.id,d.reference,d.statut,NULL FROM des.point_desserte d JOIN des.liaison_desserte_consommation l ON l.point_desserte_id=d.id WHERE l.point_consommation_id=? AND l.periode @> now()", point);
    ResumeObjet contrat = objetFacultatif("SELECT id,reference,statut,nature_abonnement FROM abo.contrat_abonnement WHERE point_consommation_id=? AND statut='ACTIF'", point);
    ResumeObjet titulaire = jdbc.query("SELECT t.id,t.reference,t.statut,COALESCE(pp.prenoms||' '||pp.nom,pm.raison_sociale) FROM abo.participation_contrat p JOIN abo.contrat_abonnement c ON c.id=p.contrat_id JOIN ref.tiers t ON t.id=p.tiers_id LEFT JOIN ref.tiers_personne_physique pp ON pp.tiers_id=t.id LEFT JOIN ref.tiers_personne_morale pm ON pm.tiers_id=t.id WHERE c.point_consommation_id=? AND c.statut='ACTIF' AND p.principal AND p.periode @> current_date",(rs,n)->new ResumeObjet(rs.getObject(1,UUID.class),rs.getString(2),rs.getString(3),rs.getString(4)),point).stream().findFirst().orElse(null);
    ResumeObjet compteur = jdbc.query("SELECT c.id,c.numero_serie,c.statut,concat_ws(' ',c.fabricant,c.modele) FROM cpt.compteur c JOIN cpt.affectation_compteur a ON a.compteur_id=c.id WHERE a.point_consommation_id=? AND a.periode @> now()",(rs,n)->new ResumeObjet(rs.getObject(1,UUID.class),rs.getString(2),rs.getString(3),rs.getString(4)),point).stream().findFirst().orElse(null);
    return new SyntheseDossier(consommation,desserte,contrat,titulaire,compteur,activite(point));
  }

  private List<Activite> activite(UUID point) {
    return jdbc.query("SELECT e.type_evenement,e.date_metier,e.type_agregat,e.agregat_id,e.correlation_id,COALESCE(pd.reference,pc.reference,ca.reference,c.numero_serie,t.reference) FROM evt.evenement_metier e LEFT JOIN des.point_desserte pd ON pd.id=e.agregat_id LEFT JOIN des.point_consommation pc ON pc.id=e.agregat_id LEFT JOIN abo.contrat_abonnement ca ON ca.id=e.agregat_id LEFT JOIN cpt.compteur c ON c.id=e.agregat_id LEFT JOIN ref.tiers t ON t.id=e.agregat_id WHERE e.agregat_id=? OR ca.point_consommation_id=? OR EXISTS(SELECT 1 FROM cpt.affectation_compteur a WHERE a.compteur_id=e.agregat_id AND a.point_consommation_id=?) ORDER BY e.date_metier DESC LIMIT 30",(rs,n)->new Activite(rs.getString(1),rs.getTimestamp(2).toInstant(),libelle(rs.getString(1)),rs.getString(3),rs.getObject(4,UUID.class),rs.getString(6),null,rs.getObject(5,UUID.class)),point,point,point);
  }

  private long compter(String sql) { Long valeur=jdbc.queryForObject(sql,Long.class); return valeur==null?0:valeur; }
  private ResumeObjet objet(String sql,UUID id) { return jdbc.queryForObject(sql,(rs,n)->new ResumeObjet(rs.getObject(1,UUID.class),rs.getString(2),rs.getString(3),rs.getString(4)),id); }
  private ResumeObjet objetFacultatif(String sql,UUID id) { return jdbc.query(sql,(rs,n)->new ResumeObjet(rs.getObject(1,UUID.class),rs.getString(2),rs.getString(3),rs.getString(4)),id).stream().findFirst().orElse(null); }
  private static String libelle(String type) { return type.replace('_',' ').toLowerCase(); }
  public record Indicateurs(long tiersActifs,long pointsOuverts,long contratsActifs,long compteursPoses) {}
  public record Adresse(UUID identifiant,String numero,String voie,String codePostal,String commune,String lieuDit) { public String libelle(){return String.join(" ",numero==null?"":numero,voie,codePostal,commune)+(lieuDit==null?"":" · "+lieuDit);}}
  public record ResumeObjet(UUID identifiant,String reference,String statut,String libelle) {}
  public record Activite(String typeEvenement,Instant dateMetier,String libelle,String typeAgregat,UUID identifiantAgregat,String referenceAgregat,String acteur,UUID correlation) {}
  public record SyntheseDossier(ResumeObjet pointConsommation,ResumeObjet pointDesserteCourant,ResumeObjet contratActif,ResumeObjet titulairePrincipal,ResumeObjet compteurActif,List<Activite> activiteRecente) {}
}
