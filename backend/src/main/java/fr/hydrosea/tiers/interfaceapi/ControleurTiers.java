package fr.hydrosea.tiers.interfaceapi;

import fr.hydrosea.commun.application.ServiceIdempotence;
import fr.hydrosea.commun.interfaceapi.FiltreCorrelation;
import fr.hydrosea.tiers.application.ServiceTiers;
import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.ArchiverTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.CreerTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.ModifierTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.PageTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.VueTiers;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/tiers")
public class ControleurTiers {
  private final ServiceTiers service; private final ServiceIdempotence idempotence;
  public ControleurTiers(ServiceTiers service, ServiceIdempotence idempotence) { this.service=service; this.idempotence=idempotence; }

  @GetMapping
  @PreAuthorize("hasAuthority('SCOPE_tiers:lecture')")
  public PageTiers rechercher(@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int taillePage,
      @RequestParam(required=false) String recherche,@RequestParam(required=false) String reference,
      @RequestParam(required=false) CategorieTiers categorie,@RequestParam(required=false) String statut) {
    return PageTiers.depuis(service.rechercher(recherche,reference,categorie,statut,page,taillePage));
  }
  @PostMapping
  @PreAuthorize("hasAuthority('SCOPE_tiers:ecriture')")
  public ResponseEntity<VueTiers> creer(@RequestHeader("Idempotency-Key") String cle,@Valid @RequestBody CreerTiers requete) {
    UUID correlation=FiltreCorrelation.courante();
    var resultat=idempotence.executer(cle,"CREER_TIERS","/v1/tiers",requete,correlation,VueTiers.class,HttpStatus.CREATED,
        () -> VueTiers.depuis(service.creer(requete.commande(),correlation)));
    return ResponseEntity.status(resultat.statut()).location(URI.create("/v1/tiers/"+resultat.corps().identifiantTiers()))
        .eTag(etag(resultat.corps().version())).body(resultat.corps());
  }
  @GetMapping("/{identifiant}")
  @PreAuthorize("hasAuthority('SCOPE_tiers:lecture')")
  public ResponseEntity<VueTiers> consulter(@PathVariable UUID identifiant) {
    VueTiers vue=VueTiers.depuis(service.consulter(identifiant));
    return ResponseEntity.ok().eTag(etag(vue.version())).body(vue);
  }
  @PatchMapping("/{identifiant}")
  @PreAuthorize("hasAuthority('SCOPE_tiers:ecriture')")
  public ResponseEntity<VueTiers> modifier(@PathVariable UUID identifiant,@RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
      @Valid @RequestBody ModifierTiers requete) {
    VueTiers vue=VueTiers.depuis(service.modifier(identifiant,requete.commande(),version(ifMatch),FiltreCorrelation.courante()));
    return ResponseEntity.ok().eTag(etag(vue.version())).body(vue);
  }
  @PostMapping("/{identifiant}/archiver")
  @PreAuthorize("hasAuthority('SCOPE_tiers:ecriture')")
  public ResponseEntity<VueTiers> archiver(@PathVariable UUID identifiant,@RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
      @RequestHeader("Idempotency-Key") String cle,@Valid @RequestBody ArchiverTiers requete) {
    UUID correlation=FiltreCorrelation.courante(); String uri="/v1/tiers/"+identifiant+"/archiver";
    var resultat=idempotence.executer(cle,"ARCHIVER_TIERS",uri,requete,correlation,VueTiers.class,HttpStatus.OK,
        () -> VueTiers.depuis(service.archiver(identifiant,version(ifMatch),correlation)));
    return ResponseEntity.status(resultat.statut()).eTag(etag(resultat.corps().version())).body(resultat.corps());
  }
  private static int version(String valeur) {
    if (valeur==null || !valeur.matches("\"[1-9][0-9]*\"")) throw new IllegalArgumentException("If-Match doit contenir une version entre guillemets.");
    return Integer.parseInt(valeur.substring(1,valeur.length()-1));
  }
  private static String etag(int version) { return "\""+version+"\""; }
}
