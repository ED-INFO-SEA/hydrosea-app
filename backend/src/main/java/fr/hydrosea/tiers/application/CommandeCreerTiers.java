package fr.hydrosea.tiers.application;

import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;

public record CommandeCreerTiers(CategorieTiers categorie, PersonnePhysique personnePhysique,
                                 PersonneMorale personneMorale) {}
