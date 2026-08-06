package fr.hydrosea.tiers.interfaceapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnore;
import fr.hydrosea.tiers.application.CommandeCreerTiers;
import fr.hydrosea.tiers.application.CommandeModifierTiers;
import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import fr.hydrosea.tiers.domaine.Tiers;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.AssertTrue;
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
  public record CreerTiers(@NotBlank @Pattern(regexp="PERSONNE_PHYSIQUE|PERSONNE_MORALE") String categorie,
      @Valid PersonnePhysiqueCommande personnePhysique,
      @Valid PersonneMoraleCommande personneMorale) {
    CommandeCreerTiers commande() {
      return new CommandeCreerTiers(CategorieTiers.valueOf(categorie), personnePhysique == null ? null : personnePhysique.domaine(),
          personneMorale == null ? null : personneMorale.domaine());
    }
    @JsonIgnore @AssertTrue(message="La catégorie exige exactement sa spécialisation complète.")
    public boolean isSpecialisationValide() {
      return ("PERSONNE_PHYSIQUE".equals(categorie) && personnePhysique != null && personneMorale == null)
          || ("PERSONNE_MORALE".equals(categorie) && personneMorale != null && personnePhysique == null);
    }
  }
  public record ModifierTiers(@Valid PersonnePhysiqueCommande personnePhysique,
      @Valid PersonneMoraleCommande personneMorale) {
    CommandeModifierTiers commande() {
      return new CommandeModifierTiers(personnePhysique == null ? null : personnePhysique.domaine(),
          personneMorale == null ? null : personneMorale.domaine());
    }
    @JsonIgnore @AssertTrue(message="Le PATCH exige exactement une spécialisation complète.")
    public boolean isSpecialisationValide() { return (personnePhysique == null) != (personneMorale == null); }
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
