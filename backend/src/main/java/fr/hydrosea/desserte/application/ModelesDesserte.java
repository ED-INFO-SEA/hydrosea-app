package fr.hydrosea.desserte.application;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public final class ModelesDesserte {
  private ModelesDesserte() {}
  public record CreerPointDesserteRequete(UUID identifiantCommune, UUID identifiantAdresse) {}
  public record ChangerDisponibilitePointDesserteRequete(String motif) {}
  public record CreerPointConsommationRequete(String usage, UUID identifiantAdresse, UUID identifiantPointDesserte) {}
  public record ModifierPointConsommationRequete(String usage) {}
  public record RattacherPointConsommationRequete(UUID identifiantPointDesserte, OffsetDateTime dateDebutValidite) {}
  public record OuvrirPointConsommationRequete(String motif) {}
  public record CommandeCreerPointDesserte(UUID identifiantCommune, UUID identifiantAdresse) {}
  public record CommandeCreerPointConsommation(String usage, UUID identifiantAdresse, UUID identifiantPointDesserte) {}
  public record CommandeModifierPointConsommation(String usage) {}
  public record CommandeRattacherPointConsommation(UUID identifiantPointDesserte, OffsetDateTime dateDebutValidite) {}
  public record VuePointDesserte(UUID id, String reference, String statut, UUID identifiantCommune, UUID identifiantAdresse, int version) {}
  public record VuePointConsommation(UUID id, String reference, String statut, String usage, UUID identifiantAdresse, int version) {}
  public record PagePointsDesserte(List<VuePointDesserte> resultats, int page, int taille, int total) {}
  public record PagePointsConsommation(List<VuePointConsommation> resultats, int page, int taille, int total) {}
}
