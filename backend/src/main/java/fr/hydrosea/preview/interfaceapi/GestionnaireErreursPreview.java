package fr.hydrosea.preview.interfaceapi;
import fr.hydrosea.preview.application.ServicePreview;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GestionnaireErreursPreview {
 @ExceptionHandler(ServicePreview.VersionObsolete.class) ResponseEntity<Map<String,Object>> version(){return ResponseEntity.status(412).body(Map.of("code","VERSION_OBSOLETE","titre","Conflit de version","detail","La fiche a été modifiée. Rechargez-la avant de recommencer."));}
 @ExceptionHandler(ServicePreview.RegleMetier.class) ResponseEntity<Map<String,Object>> metier(ServicePreview.RegleMetier e){return ResponseEntity.status(409).body(Map.of("code","REGLE_METIER","titre","Règle métier non satisfaite","detail",e.getMessage()));}
}
