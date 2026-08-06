package fr.hydrosea.tiers.application;

import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.domaine.Tiers;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PortTiers {
  Tiers creer(Tiers tiers);
  Optional<Tiers> trouver(UUID identifiant);
  Page<Tiers> rechercher(String recherche, String reference, CategorieTiers categorie, String statut, Pageable page);
  Tiers mettreAJour(Tiers tiers, int versionAttendue);
  ResultatDetectionDoublon detecterDoublon(Tiers tiers);
}
