package fr.hydrosea.tiers.application;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import fr.hydrosea.evenements.application.PortEvenements;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import org.junit.jupiter.api.Test;

class ServiceTiersTest {
  @Test void refuse_un_doublon_probable_avant_evenement() {
    PortTiers port=mock(PortTiers.class); PortEvenements evenements=mock(PortEvenements.class);
    when(port.doublonProbable(any())).thenReturn(true);
    ServiceTiers service=new ServiceTiers(port,evenements);
    var commande=new CommandesTiers.Creer("PERSONNE_PHYSIQUE",new PersonnePhysique("Martin",null,"Camille",null),null);
    assertThrows(DoublonProbableException.class,()->service.creer(commande,java.util.UUID.randomUUID()));
    verifyNoInteractions(evenements);
  }
}
