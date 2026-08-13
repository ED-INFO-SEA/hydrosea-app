package fr.hydrosea.commun.interfaceapi;

import fr.hydrosea.commun.application.ConflitIdempotenceException;
import fr.hydrosea.commun.application.RegleMetierException;
import fr.hydrosea.tiers.application.DoublonProbableException;
import fr.hydrosea.tiers.application.TiersAbsentException;
import fr.hydrosea.commun.application.VersionObsoleteException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GestionnaireErreursApi {
  private static final Logger LOGGER=LoggerFactory.getLogger(GestionnaireErreursApi.class);
  @ExceptionHandler({IllegalArgumentException.class,MethodArgumentNotValidException.class,ConstraintViolationException.class})
  ResponseEntity<ErreurApi> invalide(Exception e) { return reponse("API-REQUETE-INVALIDE","Requête invalide",e.getMessage(),HttpStatus.BAD_REQUEST); }
  @ExceptionHandler(TiersAbsentException.class)
  ResponseEntity<ErreurApi> absent(Exception e) { return reponse("TIE-ABSENT","Tiers absent",e.getMessage(),HttpStatus.NOT_FOUND); }
  @ExceptionHandler(ConflitIdempotenceException.class)
  ResponseEntity<ErreurApi> idempotence(Exception e) { return reponse("SYS-CLE-IDEMPOTENCE-CONFLIT","Clé d’idempotence en conflit",e.getMessage(),HttpStatus.CONFLICT); }
  @ExceptionHandler(DoublonProbableException.class)
  ResponseEntity<ErreurApi> doublon(Exception e) { return reponse("TIE-DOUBLON-CERTAIN","Doublon de Tiers",e.getMessage(),HttpStatus.CONFLICT); }
  @ExceptionHandler(RegleMetierException.class)
  ResponseEntity<ErreurApi> metier(RegleMetierException e) {
    return reponse(e.code(),"Règle métier non satisfaite",e.getMessage(),HttpStatus.CONFLICT);
  }
  @ExceptionHandler(VersionObsoleteException.class)
  ResponseEntity<ErreurApi> version(Exception e) {
    return reponse("SYS-VERSION-OBSOLETE", "Version obsolète", e.getMessage(),
        HttpStatus.PRECONDITION_FAILED);
  }
  @ExceptionHandler(AuthorizationDeniedException.class)
  ResponseEntity<ErreurApi> interdit(Exception e) { return reponse("API-AUTORISATION","Droit insuffisant","La portée requise est absente.",HttpStatus.FORBIDDEN); }
  @ExceptionHandler(Exception.class)
  ResponseEntity<ErreurApi> interne(Exception e) {
    LOGGER.error("Erreur interne corrélée",e);
    return reponse("SYS-ERREUR-INTERNE","Erreur interne","La demande n’a pas pu être traitée.",HttpStatus.INTERNAL_SERVER_ERROR);
  }
  private ResponseEntity<ErreurApi> reponse(String code,String titre,String detail,HttpStatus statut) {
    return ResponseEntity.status(statut).body(ErreurApi.creer(code,titre,detail,statut.value()));
  }
}
