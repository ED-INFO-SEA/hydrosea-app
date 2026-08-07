package fr.hydrosea.desserte.application;

import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeCreerPointDesserte;
import fr.hydrosea.desserte.application.ModelesDesserte.CommandeModifierPointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointConsommation;
import fr.hydrosea.desserte.application.ModelesDesserte.VuePointDesserte;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface PortDesserte {
  List<VuePointDesserte> listerDessertes();
  VuePointDesserte obtenirDesserte(UUID id);
  VuePointDesserte creerDesserte(UUID id, String reference, CommandeCreerPointDesserte commande);
  VuePointDesserte rendreDisponible(UUID id, int version);
  List<VuePointConsommation> listerPoints();
  VuePointConsommation obtenirPoint(UUID id);
  VuePointConsommation creerPoint(UUID id, String reference, CommandeCreerPointConsommation commande);
  VuePointConsommation modifierPoint(UUID id, int version, CommandeModifierPointConsommation commande);
  void rattacher(UUID point, UUID desserte, OffsetDateTime debut);
  VuePointConsommation ouvrir(UUID id, int version);
  String prochainReferenceDesserte();
  String prochainReferencePoint();
}
