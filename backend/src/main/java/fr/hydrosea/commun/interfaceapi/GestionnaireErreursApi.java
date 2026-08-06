package fr.hydrosea.commun.interfaceapi;

import fr.hydrosea.commun.application.ConflitIdempotenceException;
import fr.hydrosea.tiers.application.DoublonProbableException;
import fr.hydrosea.tiers.application.TiersAbsentException;
import fr.hydrosea.tiers.application.VersionObsoleteException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  @ExceptionHandler({ConflitIdempotenceException.class,DoublonProbableException.class})
  ResponseEntity<ErreurApi> conflit(Exception e) { return reponse("TIE-CONFLIT","Conflit métier",e.getMessage(),HttpStatus.CONFLICT); }
  @ExceptionHandler(VersionObsoleteException.class)
  ResponseEntity<ErreurApi> version(Exception e) { return reponse("SYS-CONFLIT-VERSION","Version obsolète",e.getMessage(),HttpStatus.PRECONDITION_FAILED); }
  @ExceptionHandler(Exception.class)
  ResponseEntity<ErreurApi> interne(Exception e) {
    LOGGER.error("Erreur interne corrélée",e);
    return reponse("SYS-ERREUR-INTERNE","Erreur interne","La demande n’a pas pu être traitée.",HttpStatus.INTERNAL_SERVER_ERROR);
  }
  private ResponseEntity<ErreurApi> reponse(String code,String titre,String detail,HttpStatus statut) {
    return ResponseEntity.status(statut).body(ErreurApi.creer(code,titre,detail,statut.value()));
  }
}

