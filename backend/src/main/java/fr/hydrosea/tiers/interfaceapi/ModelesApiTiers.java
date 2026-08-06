package fr.hydrosea.tiers.interfaceapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import fr.hydrosea.tiers.application.CommandesTiers;
import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import fr.hydrosea.tiers.domaine.Tiers;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public final class ModelesApiTiers {
  private ModelesApiTiers() {}
  public record PersonnePhysiqueCommande(@NotBlank String nom, String nomUsage, @NotBlank String prenoms, LocalDate dateNaissance) {
    PersonnePhysique domaine() { return new PersonnePhysique(nom, nomUsage, prenoms, dateNaissance); }
  }
  public record PersonneMoraleCommande(@NotBlank String raisonSociale,
      @Pattern(regexp="[0-9]{14}") String siret, String formeJuridique) {
    PersonneMorale domaine() { return new PersonneMorale(raisonSociale, siret, formeJuridique); }
  }
  public record CreerTiers(@NotBlank String categorie, @Valid PersonnePhysiqueCommande personnePhysique,
      @Valid PersonneMoraleCommande personneMorale) {
    CommandesTiers.Creer commande() {
      return new CommandesTiers.Creer(categorie, personnePhysique == null ? null : personnePhysique.domaine(),
          personneMorale == null ? null : personneMorale.domaine());
    }
  }
  public record ModifierTiers(@Valid PersonnePhysiqueCommande personnePhysique,
      @Valid PersonneMoraleCommande personneMorale) {
    CommandesTiers.Modifier commande() {
      return new CommandesTiers.Modifier(personnePhysique == null ? null : personnePhysique.domaine(),
          personneMorale == null ? null : personneMorale.domaine());
    }
  }
  public record ArchiverTiers(@NotBlank String motif) {}
  public record PersonnePhysiqueVue(String nom,String nomUsage,String prenoms) {}
  public record PersonneMoraleVue(String raisonSociale,String siret,String formeJuridique) {}
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record VueTiers(UUID identifiantTiers,String reference,String categorie,String statut,
      PersonnePhysiqueVue personnePhysique,PersonneMoraleVue personneMorale,int version,
      Instant dateCreation,Instant dateModification) {
    static VueTiers depuis(Tiers t) {
      PersonnePhysiqueVue p=t.personnePhysique()==null?null:new PersonnePhysiqueVue(t.personnePhysique().nom(),t.personnePhysique().nomUsage(),t.personnePhysique().prenoms());
      PersonneMoraleVue m=t.personneMorale()==null?null:new PersonneMoraleVue(t.personneMorale().raisonSociale(),t.personneMorale().siret(),t.personneMorale().formeJuridique());
      return new VueTiers(t.identifiant(),t.reference(),t.categorie().name(),t.statut().name(),p,m,t.version(),t.dateCreation(),t.dateModification());
    }
  }
  public record PageTiers(int page,int taillePage,long nombreTotal,String lienPrecedent,String lienSuivant,List<VueTiers> resultats) {
    static PageTiers depuis(Page<Tiers> resultat) {
      return new PageTiers(resultat.getNumber()+1,resultat.getSize(),resultat.getTotalElements(),null,null,
          resultat.getContent().stream().map(VueTiers::depuis).toList());
    }
  }
}

