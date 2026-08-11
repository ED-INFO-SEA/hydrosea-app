package fr.hydrosea.desserte.infrastructure;

import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointDesserte;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeModifierPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointDesserte;
import fr.hydrosea.commun.application.RegleMetierException;
import fr.hydrosea.commun.application.VersionObsoleteException;
import fr.hydrosea.desserte.application.PortDesserte;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdaptateurJdbcDesserte implements PortDesserte {
  private final JdbcTemplate jdbc;
  public AdaptateurJdbcDesserte(JdbcTemplate jdbc) { this.jdbc=jdbc; }
  private static final org.springframework.jdbc.core.RowMapper<VuePointDesserte> DESSERTE=(rs,n)->new VuePointDesserte(rs.getObject("id",UUID.class),rs.getString("reference"),rs.getString("statut"),rs.getObject("identifiant_commune",UUID.class),rs.getObject("identifiant_adresse",UUID.class),rs.getInt("version"));
  private static final org.springframework.jdbc.core.RowMapper<VuePointConsommation> POINT=(rs,n)->new VuePointConsommation(rs.getObject("id",UUID.class),rs.getString("reference"),rs.getString("statut"),rs.getString("usage"),rs.getObject("identifiant_adresse",UUID.class),rs.getInt("version"));
  public List<VuePointDesserte> listerDessertes(){return jdbc.query("SELECT id,reference,statut,identifiant_commune,identifiant_adresse,version FROM des.point_desserte WHERE date_suppression IS NULL ORDER BY date_creation DESC LIMIT 100",DESSERTE);}
  public VuePointDesserte obtenirDesserte(UUID id){return jdbc.queryForObject("SELECT id,reference,statut,identifiant_commune,identifiant_adresse,version FROM des.point_desserte WHERE id=?",DESSERTE,id);}
  public VuePointDesserte creerDesserte(UUID id,String reference,CommandeCreerPointDesserte c){jdbc.update("INSERT INTO des.point_desserte(id,reference,statut,identifiant_commune,identifiant_adresse) VALUES (?,?,'CREE',?,?)",id,reference,c.identifiantCommune(),c.identifiantAdresse());return obtenirDesserte(id);}
  public VuePointDesserte rendreDisponible(UUID id,int version){if(jdbc.update("UPDATE des.point_desserte SET statut='DISPONIBLE',version=version+1 WHERE id=? AND version=?",id,version)==0)throw new VersionObsoleteException();return obtenirDesserte(id);}
  public List<VuePointConsommation> listerPoints(){return jdbc.query("SELECT id,reference,statut,usage,identifiant_adresse,version FROM des.point_consommation WHERE date_suppression IS NULL ORDER BY date_creation DESC LIMIT 100",POINT);}
  public VuePointConsommation obtenirPoint(UUID id){return jdbc.queryForObject("SELECT id,reference,statut,usage,identifiant_adresse,version FROM des.point_consommation WHERE id=?",POINT,id);}
  public VuePointConsommation creerPoint(UUID id,String reference,CommandeCreerPointConsommation c){jdbc.update("INSERT INTO des.point_consommation(id,reference,usage,identifiant_adresse) VALUES (?,?,?,?)",id,reference,c.usage(),c.identifiantAdresse());return obtenirPoint(id);}
  public VuePointConsommation modifierPoint(UUID id,int version,CommandeModifierPointConsommation c){if(jdbc.update("UPDATE des.point_consommation SET usage=COALESCE(?,usage),version=version+1,date_modification=now() WHERE id=? AND version=?",c.usage(),id,version)==0)throw new VersionObsoleteException();return obtenirPoint(id);}
  public void rattacher(UUID point,UUID desserte,OffsetDateTime debut){String statut=jdbc.queryForObject("SELECT statut FROM des.point_desserte WHERE id=?",String.class,desserte);if(!"DISPONIBLE".equals(statut))throw new RegleMetierException("La desserte doit être disponible.");jdbc.update("INSERT INTO des.liaison_desserte_consommation(id,point_desserte_id,point_consommation_id,periode) VALUES (?,?,?,tstzrange(?,NULL,'[)'))",UUID.randomUUID(),desserte,point,debut);}
  public VuePointConsommation ouvrir(UUID id,int version){Integer n=jdbc.queryForObject("SELECT count(*) FROM des.liaison_desserte_consommation l JOIN des.point_desserte d ON d.id=l.point_desserte_id WHERE l.point_consommation_id=? AND l.periode @> now() AND d.statut='DISPONIBLE'",Integer.class,id);if(n==null||n==0)throw new RegleMetierException("Un rattachement à une desserte disponible est requis.");if(jdbc.update("UPDATE des.point_consommation SET statut='OUVERT',version=version+1 WHERE id=? AND version=?",id,version)==0)throw new VersionObsoleteException();return obtenirPoint(id);}
  public String prochainReferenceDesserte(){return reference("PD","des.reference_point_desserte_seq");}
  public String prochainReferencePoint(){return reference("PC","des.reference_point_consommation_seq");}
  private String reference(String prefixe,String sequence){Long valeur=jdbc.queryForObject("SELECT nextval('"+sequence+"')",Long.class);return "%s-%d-%06d".formatted(prefixe,LocalDate.now().getYear(),valeur);}
}
