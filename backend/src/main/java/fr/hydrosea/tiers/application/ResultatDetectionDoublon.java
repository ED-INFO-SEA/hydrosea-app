package fr.hydrosea.tiers.application;

import java.util.List;
import java.util.UUID;

public record ResultatDetectionDoublon(Niveau niveau, boolean bloquant, String motif,
                                       List<UUID> candidats) {
  public enum Niveau { AUCUN, SIGNAL, CERTAIN }
  public static ResultatDetectionDoublon aucun() {
    return new ResultatDetectionDoublon(Niveau.AUCUN, false, "Aucune correspondance active.", List.of());
  }
}
