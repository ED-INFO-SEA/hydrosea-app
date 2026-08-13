package fr.hydrosea.tiers.application;

import fr.hydrosea.evenements.application.PortEvenements;
import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.domaine.StatutTiers;
import fr.hydrosea.tiers.domaine.Tiers;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceTiers {
  private final PortTiers port;
  private final PortEvenements evenements;

  public ServiceTiers(PortTiers port, PortEvenements evenements) {
    this.port = port;
    this.evenements = evenements;
  }

  @Transactional
  public Tiers creer(CommandeCreerTiers commande, UUID correlation) {
    Tiers candidat = new Tiers(UUID.randomUUID(), null, commande.categorie(), StatutTiers.ACTIF,
        commande.personnePhysique(), commande.personneMorale(), 1, Instant.now(), Instant.now());
    ResultatDetectionDoublon doublon = port.detecterDoublon(candidat);
    if (doublon.bloquant()) throw new DoublonProbableException(doublon);
    Tiers cree = port.creer(candidat);
    evenements.enregistrer("TIERS_CREE", "TIERS", cree.identifiant(), correlation,
        Map.of("identifiant_tiers", cree.identifiant(), "reference", cree.reference(), "categorie", cree.categorie()));
    return cree;
  }

  @Transactional(readOnly = true)
  public Tiers consulter(UUID identifiant) {
    return port.trouver(identifiant).orElseThrow(TiersAbsentException::new);
  }

  @Transactional(readOnly = true)
  public Page<Tiers> rechercher(String recherche, String reference, CategorieTiers categorie,
      String statut, int page, int taille, String tri, String direction) {
    if (page < 1) throw new IllegalArgumentException("La page doit être supérieure ou égale à 1.");
    if (taille < 1 || taille > 100) {
      throw new IllegalArgumentException("La taille de page doit être comprise entre 1 et 100.");
    }
    org.springframework.data.domain.Sort.Direction sens;
    try { sens = org.springframework.data.domain.Sort.Direction.fromString(direction); }
    catch (IllegalArgumentException exception) {
      throw new IllegalArgumentException("La direction de tri doit être asc ou desc.");
    }
    return port.rechercher(recherche, reference, categorie, statut,
        PageRequest.of(page - 1, taille, org.springframework.data.domain.Sort.by(sens, tri)));
  }

  @Transactional
  public Tiers modifier(UUID identifiant, CommandeModifierTiers commande, int version, UUID correlation) {
    Tiers actuel = consulter(identifiant);
    if ((actuel.categorie() == CategorieTiers.PERSONNE_PHYSIQUE && commande.personneMorale() != null)
        || (actuel.categorie() == CategorieTiers.PERSONNE_MORALE && commande.personnePhysique() != null)) {
      throw new IllegalArgumentException("La catégorie d’un Tiers ne peut pas être modifiée.");
    }
    Tiers modifie = new Tiers(actuel.identifiant(), actuel.reference(), actuel.categorie(), actuel.statut(),
        commande.personnePhysique() == null ? actuel.personnePhysique() : commande.personnePhysique(),
        commande.personneMorale() == null ? actuel.personneMorale() : commande.personneMorale(),
        actuel.version(), actuel.dateCreation(), Instant.now());
    Tiers resultat = port.mettreAJour(modifie, version);
    evenements.enregistrer("TIERS_MODIFIE", "TIERS", identifiant, correlation,
        Map.of("identifiant_tiers", identifiant, "version", resultat.version()));
    return resultat;
  }

  @Transactional
  public Tiers archiver(UUID identifiant, int version, UUID correlation) {
    Tiers resultat = port.mettreAJour(consulter(identifiant).archiver(), version);
    evenements.enregistrer("TIERS_ARCHIVE", "TIERS", identifiant, correlation,
        Map.of("identifiant_tiers", identifiant, "version", resultat.version()));
    return resultat;
  }
}
