package fr.hydrosea.preview.interfaceapi;

import fr.hydrosea.preview.application.ServicePreview;
import fr.hydrosea.preview.application.ServiceLecturePreview;
import fr.hydrosea.preview.application.ServiceLecturePreview.Indicateurs;
import fr.hydrosea.preview.application.ServiceLecturePreview.Adresse;
import fr.hydrosea.preview.application.ServiceLecturePreview.SyntheseDossier;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/v1")
public class ControleurPreview {
 private final ServicePreview service; private final ServiceLecturePreview lecture;
 public ControleurPreview(ServicePreview service,ServiceLecturePreview lecture){this.service=service;this.lecture=lecture;}
 private int version(String valeur){return Integer.parseInt(valeur.replace("\"",""));}
 @OperationPreview("rechercher_points_desserte") @GetMapping("/points-desserte") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> dessertes(){return Map.of("resultats",service.lister("des.point_desserte"),"page",0,"taille",100,"total",service.lister("des.point_desserte").size());}
 @OperationPreview("creer_point_desserte") @PostMapping("/points-desserte") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> creerDesserte(@RequestBody Map<String,Object> c){return service.creerDesserte(c);}
 @OperationPreview("consulter_point_desserte") @GetMapping("/points-desserte/{id}") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> desserte(@PathVariable UUID id){return service.obtenir("des.point_desserte",id);}
 @OperationPreview("rendre_disponible_point_desserte") @PostMapping("/points-desserte/{id}/rendre-disponible") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> disponible(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> requete){return service.disponibiliser(id,version(v));}
 @OperationPreview("rechercher_points_consommation") @GetMapping("/points-consommation") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> consommations(){var l=service.lister("des.point_consommation");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @OperationPreview("creer_point_consommation") @PostMapping("/points-consommation") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> creerConsommation(@RequestBody Map<String,Object> c){return service.creerConsommation(c);}
 @OperationPreview("consulter_point_consommation") @GetMapping("/points-consommation/{id}") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Map<String,Object> consommation(@PathVariable UUID id){return service.obtenir("des.point_consommation",id);}
 @OperationPreview("modifier_point_consommation") @PatchMapping("/points-consommation/{id}") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> modifierConsommation(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> c){return service.modifierConsommation(id,version(v),c);}
 @OperationPreview("rattacher_point_consommation_desserte") @PostMapping("/points-consommation/{id}/rattachements-desserte") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> rattacher(@PathVariable UUID id,@RequestBody Map<String,Object> c){return service.rattacher(id,UUID.fromString(c.get("identifiant_point_desserte").toString()),OffsetDateTime.parse(c.get("date_debut_validite").toString()));}
 @OperationPreview("ouvrir_point_consommation") @PostMapping("/points-consommation/{id}/ouvrir") @PreAuthorize("hasAuthority('SCOPE_points:ecriture')") public Map<String,Object> ouvrir(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> requete){return service.ouvrir(id,version(v));}
 @OperationPreview("rechercher_contrats_abonnement") @GetMapping("/contrats-abonnement") @PreAuthorize("hasAuthority('SCOPE_contrats:lecture')") public Map<String,Object> contrats(){var l=service.lister("abo.contrat_abonnement");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @OperationPreview("creer_contrat_abonnement") @PostMapping("/contrats-abonnement") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> creerContrat(@RequestBody Map<String,Object> c){return service.creerContrat(c);}
 @OperationPreview("consulter_contrat_abonnement") @GetMapping("/contrats-abonnement/{id}") @PreAuthorize("hasAuthority('SCOPE_contrats:lecture')") public Map<String,Object> contrat(@PathVariable UUID id){return service.obtenir("abo.contrat_abonnement",id);}
 @OperationPreview("modifier_contrat_abonnement") @PatchMapping("/contrats-abonnement/{id}") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> modifierContrat(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> c){return service.modifierContrat(id,version(v),c);}
 @OperationPreview("ajouter_participant_contrat") @PostMapping("/contrats-abonnement/{id}/participants") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> participant(@PathVariable UUID id,@RequestBody Map<String,Object> c){return service.ajouterParticipant(id,c);}
 @OperationPreview("valider_contrat_abonnement") @PostMapping("/contrats-abonnement/{id}/valider") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> valider(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> requete){return service.valider(id,version(v));}
 @OperationPreview("activer_contrat_abonnement") @PostMapping("/contrats-abonnement/{id}/activer") @PreAuthorize("hasAuthority('SCOPE_contrats:ecriture')") public Map<String,Object> activer(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> requete){return service.activer(id,version(v));}
 @OperationPreview("rechercher_compteurs") @GetMapping("/compteurs") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> compteurs(){var l=service.lister("cpt.compteur");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @OperationPreview("enregistrer_compteur") @PostMapping("/compteurs") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_comptage:ecriture')") public Map<String,Object> compteur(@RequestBody Map<String,Object> c){return service.enregistrerCompteur(c);}
 @OperationPreview("consulter_compteur") @GetMapping("/compteurs/{id}") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> compteur(@PathVariable UUID id){return service.obtenir("cpt.compteur",id);}
 @OperationPreview("modifier_compteur") @PatchMapping("/compteurs/{id}") @PreAuthorize("hasAuthority('SCOPE_comptage:ecriture')") public Map<String,Object> modifierCompteur(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> c){return service.modifierCompteur(id,version(v),c);}
 @OperationPreview("poser_compteur") @PostMapping("/compteurs/{id}/poser") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('SCOPE_comptage:ecriture')") public Map<String,Object> poser(@PathVariable UUID id,@RequestHeader("If-Match") String v,@RequestBody Map<String,Object> c){return service.poser(id,version(v),c);}
 @OperationPreview("rechercher_affectations_compteur") @GetMapping("/affectations-compteur") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> affectations(){var l=service.lister("cpt.affectation_compteur");return Map.of("resultats",l,"page",0,"taille",100,"total",l.size());}
 @OperationPreview("consulter_affectation_compteur") @GetMapping("/affectations-compteur/{id}") @PreAuthorize("hasAuthority('SCOPE_comptage:lecture')") public Map<String,Object> affectation(@PathVariable UUID id){return service.obtenir("cpt.affectation_compteur",id);}
 @GetMapping("/preview/dossiers/{id}/activite") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public List<Map<String,Object>> activite(@PathVariable UUID id){return service.activite(id);}
 @GetMapping("/preview/indicateurs") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public Indicateurs indicateurs(){return lecture.indicateurs();}
 @GetMapping("/preview/adresses") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public List<Adresse> adresses(){return lecture.adresses();}
 @GetMapping("/preview/dossiers/{id}") @PreAuthorize("hasAuthority('SCOPE_points:lecture')") public SyntheseDossier synthese(@PathVariable UUID id){return lecture.synthese(id);}
}
