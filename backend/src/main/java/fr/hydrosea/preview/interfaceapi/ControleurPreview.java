package fr.hydrosea.preview.interfaceapi;

import fr.hydrosea.preview.application.ServicePreview;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/v1")
public class ControleurPreview {
 private final ServicePreview service; public ControleurPreview(ServicePreview service){this.service=service;}
 private int version(String valeur){return Integer.parseInt(valeur.replace("\"",""));}
 @GetMapping("/points-desserte") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> dessertes(){return Map.of("resultats",service.lister("des.point_desserte"),"page",0,"taille",100,"total",service.lister("des.point_desserte").size());}
 @PostMapping("/points-desserte") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> creerDesserte(@RequestBody Map<String,Object> c){return service.creerDesserte(c);}
 @GetMapping("/points-desserte/{id}") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> desserte(@PathVariable UUID id){return service.obtenir("des.point_desserte",id);}
 @PostMapping("/points-desserte/{id}/rendre-disponible") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> disponible(@PathVariable UUID id,@RequestHeader("If-Match") String v){return service.disponibiliser(id,version(v));}
 @GetMapping("/points-consommation") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> consommations(){var l=service.lister("des.point_consommation");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @PostMapping("/points-consommation") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> creerConsommation(@RequestBody Map<String,Object> c){return service.creerConsommation(c);}
 @GetMapping("/points-consommation/{id}") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> consommation(@PathVariable UUID id){return service.obtenir("des.point_consommation",id);}
 @PostMapping("/points-consommation/{id}/rattachements") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> rattacher(@PathVariable UUID id,@RequestBody Map<String,Object> c){return service.rattacher(id,UUID.fromString(c.get("identifiant_point_desserte").toString()),OffsetDateTime.parse(c.get("date_debut_validite").toString()));}
 @PostMapping("/points-consommation/{id}/ouvrir") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> ouvrir(@PathVariable UUID id,@RequestHeader("If-Match") String v){return service.ouvrir(id,version(v));}
 @GetMapping("/contrats-abonnement") @PreAuthorize("hasAuthority('SCOPE_contrats:lecture')") public Map<String,Object> contrats(){var l=service.lister("abo.contrat_abonnement");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @PostMapping("/contrats-abonnement") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> creerContrat(@RequestBody Map<String,Object> c){return service.creerContrat(c);}
 @GetMapping("/contrats-abonnement/{id}") @PreAuthorize("hasAuthority('SCOPE_contrats:lecture')") public Map<String,Object> contrat(@PathVariable UUID id){return service.obtenir("abo.contrat_abonnement",id);}
 @PostMapping("/contrats-abonnement/{id}/participants") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> participant(@PathVariable UUID id,@RequestBody Map<String,Object> c){return service.ajouterParticipant(id,c);}
 @PostMapping("/contrats-abonnement/{id}/valider") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> valider(@PathVariable UUID id,@RequestHeader("If-Match") String v){return service.valider(id,version(v));}
 @PostMapping("/contrats-abonnement/{id}/activer") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> activer(@PathVariable UUID id,@RequestHeader("If-Match") String v){return service.activer(id,version(v));}
 @GetMapping("/compteurs") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> compteurs(){var l=service.lister("cpt.compteur");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @PostMapping("/compteurs") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_comptage:ecriture')") public Map<String,Object> compteur(@RequestBody Map<String,Object> c){return service.enregistrerCompteur(c);}
 @GetMapping("/compteurs/{id}") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> compteur(@PathVariable UUID id){return service.obtenir("cpt.compteur",id);}
 @PostMapping("/compteurs/{id}/poser") @PreAuthorize("hasAuthority('SCOPE_comptage:ecriture')") public Map<String,Object> poser(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> c){return service.poser(id,version(v),c);}
 @GetMapping("/affectations-compteur") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> affectations(){var l=service.lister("cpt.affectation_compteur");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @GetMapping("/affectations-compteur/{id}") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> affectation(@PathVariable UUID id){return service.obtenir("cpt.affectation_compteur",id);}
 @GetMapping("/preview/dossiers/{id}/activite") public List<Map<String,Object>> activite(@PathVariable UUID id){return service.activite(id);}
}
