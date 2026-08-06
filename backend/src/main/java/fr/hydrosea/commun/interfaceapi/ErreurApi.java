package fr.hydrosea.commun.interfaceapi;

import java.time.Instant;
import java.util.UUID;

public record ErreurApi(String code,String titre,String detail,int statutHttp,UUID identifiantCorrelation,
                        Instant dateErreur,String champ,String regleMetier,String serviceMetier) {
  public static ErreurApi creer(String code,String titre,String detail,int statut) {
    return new ErreurApi(code,titre,detail,statut,FiltreCorrelation.courante(),Instant.now(),null,null,null);
  }
}

