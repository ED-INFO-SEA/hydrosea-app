package fr.hydrosea.abonnements.application;
import java.time.LocalDate;import java.time.OffsetDateTime;import java.util.List;import java.util.UUID;
public final class ModelesAbonnements {private ModelesAbonnements(){}
 public record CreerContratAbonnementRequete(UUID identifiantPointConsommation,String natureAbonnement,LocalDate dateDemande,LocalDate dateEffetSouhaitee){}
 public record ModifierContratAbonnementRequete(String natureAbonnement){}
 public record AjouterParticipantContratRequete(UUID identifiantTiers,String roleContractuel,Boolean responsabiliteFinanciere,LocalDate dateDebutValidite){}
 public record ValiderContratRequete(String motif){} public record ActiverContratRequete(String motif){}
 public record CommandeCreerContrat(UUID point,String nature,LocalDate demande,LocalDate effet){}
 public record CommandeModifierContrat(String nature){}
 public record CommandeAjouterParticipant(UUID tiers,String role,boolean responsabilite,LocalDate debut){}
 public record VueContrat(UUID id,String reference,UUID pointConsommationId,String natureAbonnement,LocalDate dateDemande,LocalDate dateEffet,String statut,int version){}
 public record VueParticipant(UUID id,UUID contratId,UUID tiersId,String roleContractuel,boolean principal,boolean responsabiliteFinanciere,OffsetDateTime dateCreation){}
 public record PageContrats(List<VueContrat> resultats,int page,int taille,int total){}
}
