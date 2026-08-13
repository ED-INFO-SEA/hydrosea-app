package fr.hydrosea.desserte.application;

import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointDesserte;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeModifierPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeRattacherPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointDesserte;
import fr.hydrosea.evenements.application.PortEvenements;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceDesserte {
  private final PortDesserte port; private final PortEvenements evenements;
  public ServiceDesserte(PortDesserte port, PortEvenements evenements) { this.port=port; this.evenements=evenements; }
  public Page<VuePointDesserte> listerDessertes(Pageable page) { return port.listerDessertes(page); }
  public VuePointDesserte consulterDesserte(UUID id) { return port.obtenirDesserte(id); }
  public Page<VuePointConsommation> listerPoints(Pageable page) { return port.listerPoints(page); }
  public VuePointConsommation consulterPoint(UUID id) { return port.obtenirPoint(id); }
  @Transactional public VuePointDesserte creer(CommandeCreerPointDesserte commande, UUID correlation) { UUID id=UUID.randomUUID(); var vue=port.creerDesserte(id,port.prochainReferenceDesserte(),commande); publier("POINT_DESSERTE_CREE","POINT_DESSERTE",id,correlation); return vue; }
  @Transactional public VuePointDesserte rendreDisponible(UUID id,int version,UUID correlation) { var vue=port.rendreDisponible(id,version); publier("POINT_DESSERTE_DISPONIBLE","POINT_DESSERTE",id,correlation); return vue; }
  @Transactional public VuePointConsommation creer(CommandeCreerPointConsommation commande,UUID correlation) { UUID id=UUID.randomUUID(); var vue=port.creerPoint(id,port.prochainReferencePoint(),commande); if(commande.identifiantPointDesserte()!=null) rattacher(id,new CommandeRattacherPointConsommation(commande.identifiantPointDesserte(),java.time.OffsetDateTime.now()),correlation); publier("POINT_CONSOMMATION_CREE","POINT_CONSOMMATION",id,correlation); return port.obtenirPoint(id); }
  @Transactional public VuePointConsommation modifier(UUID id,int version,CommandeModifierPointConsommation commande,UUID correlation) { var vue=port.modifierPoint(id,version,commande); publier("POINT_CONSOMMATION_MODIFIE","POINT_CONSOMMATION",id,correlation); return vue; }
  @Transactional public VuePointConsommation rattacher(UUID id,CommandeRattacherPointConsommation commande,UUID correlation) { port.rattacher(id,commande.identifiantPointDesserte(),commande.dateDebutValidite()); publier("RATTACHEMENT_CREE","POINT_CONSOMMATION",id,correlation); return port.obtenirPoint(id); }
  @Transactional public VuePointConsommation ouvrir(UUID id,int version,UUID correlation) { var vue=port.ouvrir(id,version); publier("POINT_CONSOMMATION_OUVERT","POINT_CONSOMMATION",id,correlation); return vue; }
  private void publier(String type,String agregat,UUID id,UUID correlation) { evenements.enregistrer(type,agregat,id,correlation,Map.of("identifiant",id)); }
}
