package fr.hydrosea.tiers.domaine;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class TiersTest {
  @Test void exige_exactement_une_specialisation() {
    assertThrows(IllegalArgumentException.class,()->new Tiers(UUID.randomUUID(),"TIE-1",CategorieTiers.PERSONNE_PHYSIQUE,
        StatutTiers.ACTIF,null,null,1,Instant.now(),Instant.now()));
  }
  @Test void archive_sans_changer_identite_ni_categorie() {
    var tiers=new Tiers(UUID.randomUUID(),"TIE-1",CategorieTiers.PERSONNE_PHYSIQUE,StatutTiers.ACTIF,
        new PersonnePhysique("Martin",null,"Camille",null),null,1,Instant.now(),Instant.now());
    var archive=tiers.archiver();
    assertEquals(tiers.identifiant(),archive.identifiant()); assertEquals(StatutTiers.ARCHIVE,archive.statut());
  }
}

