package fr.hydrosea.preview.interfaceapi;
import fr.hydrosea.commun.application.RegleMetierException;
import fr.hydrosea.commun.application.VersionObsoleteException;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GestionnaireErreursPreview {
 @ExceptionHandler(VersionObsoleteException.class) ResponseEntity<Map<String,Object>> version(){return ResponseEntity.status(412).body(Map.of("code","VERSION_OBSOLETE","titre","Conflit de version","detail","La fiche a été modifiée. Rechargez-la avant de recommencer."));}
 @ExceptionHandler(RegleMetierException.class) ResponseEntity<Map<String,Object>> metier(RegleMetierException e){return ResponseEntity.status(409).body(Map.of("code",e.code(),"titre","Règle métier non satisfaite","detail",e.getMessage()));}
}
