package fr.hydrosea.comptage.application;

import fr.hydrosea.comptage.application.ModelesComptage.CommandeCreerCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandeModifierCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandePoserCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.VueAffectation;
import fr.hydrosea.comptage.application.ModelesComptage.VueCompteur;
import fr.hydrosea.evenements.application.PortEvenements;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceComptage {
  private final PortComptage port;
  private final PortEvenements evenements;

  public ServiceComptage(PortComptage port, PortEvenements evenements) {
    this.port = port;
    this.evenements = evenements;
  }

  public Page<VueCompteur> lister(Pageable page) { return port.listerCompteurs(page); }
  public VueCompteur consulter(UUID id) { return port.obtenirCompteur(id); }

  @Transactional
  public VueCompteur creer(CommandeCreerCompteur commande, UUID correlation) {
    UUID id = UUID.randomUUID();
    VueCompteur resultat = port.creer(id, commande);
    publier("COMPTEUR_ENREGISTRE", "COMPTEUR", id, correlation);
    return resultat;
  }

  @Transactional
  public VueCompteur modifier(UUID id, int version, CommandeModifierCompteur commande,
      UUID correlation) {
    VueCompteur resultat = port.modifier(id, version, commande);
    publier("COMPTEUR_MODIFIE", "COMPTEUR", id, correlation);
    return resultat;
  }

  @Transactional
  public VueAffectation poser(UUID id, int version, CommandePoserCompteur commande,
      UUID correlation) {
    VueAffectation resultat = port.poser(id, version, commande);
    publier("COMPTEUR_POSE", "COMPTEUR", id, correlation);
    publier("AFFECTATION_CREEE", "AFFECTATION_COMPTEUR", resultat.id(), correlation);
    return resultat;
  }

  public Page<VueAffectation> listerAffectations(Pageable page) {
    return port.listerAffectations(page);
  }
  public VueAffectation consulterAffectation(UUID id) { return port.obtenirAffectation(id); }

  private void publier(String type, String agregat, UUID id, UUID correlation) {
    evenements.enregistrer(type, agregat, id, correlation, Map.of("identifiant", id));
  }
}
