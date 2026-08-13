package fr.hydrosea.comptage.application;

import fr.hydrosea.comptage.application.ModelesComptage.CommandeCreerCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandeModifierCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.CommandePoserCompteur;
import fr.hydrosea.comptage.application.ModelesComptage.VueAffectation;
import fr.hydrosea.comptage.application.ModelesComptage.VueCompteur;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PortComptage {
  Page<VueCompteur> listerCompteurs(Pageable page);
  VueCompteur obtenirCompteur(UUID id);
  VueCompteur creer(UUID id, CommandeCreerCompteur commande);
  VueCompteur modifier(UUID id, int version, CommandeModifierCompteur commande);
  VueAffectation poser(UUID id, int version, CommandePoserCompteur commande);
  Page<VueAffectation> listerAffectations(Pageable page);
  VueAffectation obtenirAffectation(UUID id);
}
