package fr.hydrosea.integration;

import static org.assertj.core.api.Assertions.assertThat;
import fr.hydrosea.documents.application.PortStockageDocuments;
import fr.hydrosea.commun.application.ServiceIdempotence;
import fr.hydrosea.tiers.application.CommandeCreerTiers;
import fr.hydrosea.tiers.application.CommandeModifierTiers;
import fr.hydrosea.tiers.application.ServiceTiers;
import fr.hydrosea.tiers.application.VersionObsoleteException;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.interfaceapi.ControleurTiers;
import fr.hydrosea.tiers.interfaceapi.ModelesApiTiers.ArchiverTiers;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import java.io.ByteArrayInputStream;
import java.util.UUID;
import java.util.List;
import java.util.Map;
import java.net.URI;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest(properties={"spring.task.scheduling.enabled=false","management.health.rabbit.enabled=false"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ParcoursTiersIT {
  @Container static final PostgreSQLContainer<?> POSTGRES=new PostgreSQLContainer<>(
      DockerImageName.parse("postgis/postgis:16-3.5").asCompatibleSubstituteFor("postgres"));
  @Container static final RabbitMQContainer RABBIT=new RabbitMQContainer("rabbitmq:4.1.2-management-alpine");
  @Container static final GenericContainer<?> MINIO=new GenericContainer<>(DockerImageName.parse("quay.io/minio/minio:RELEASE.2025-04-22T22-12-26Z"))
      .withEnv("MINIO_ROOT_USER","hydrosea_test").withEnv("MINIO_ROOT_PASSWORD","secret_test_123456")
      .withCommand("server /data").withExposedPorts(9000);
  static {
    POSTGRES.start();
    RABBIT.start();
    MINIO.start();
  }
  @DynamicPropertySource static void proprietes(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url",POSTGRES::getJdbcUrl); r.add("spring.datasource.username",POSTGRES::getUsername); r.add("spring.datasource.password",POSTGRES::getPassword);
    r.add("spring.flyway.url",POSTGRES::getJdbcUrl); r.add("spring.flyway.user",POSTGRES::getUsername); r.add("spring.flyway.password",POSTGRES::getPassword);
    r.add("spring.rabbitmq.host",RABBIT::getHost); r.add("spring.rabbitmq.port",RABBIT::getAmqpPort);
    r.add("spring.rabbitmq.username",RABBIT::getAdminUsername); r.add("spring.rabbitmq.password",RABBIT::getAdminPassword);
    r.add("hydrosea.stockage.url",()->"http://"+MINIO.getHost()+":"+MINIO.getMappedPort(9000));
    r.add("hydrosea.stockage.acces",()->"hydrosea_test"); r.add("hydrosea.stockage.secret",()->"secret_test_123456"); r.add("hydrosea.stockage.bucket",()->"hydrosea-test");
  }
  @Autowired ServiceTiers service; @Autowired PortStockageDocuments stockage;
  @Autowired ServiceIdempotence idempotence; @Autowired JdbcTemplate jdbc;
  @Autowired ControleurTiers controleur;
  @BeforeAll void creerBucket() throws Exception {
    MinioClient.builder().endpoint("http://"+MINIO.getHost()+":"+MINIO.getMappedPort(9000)).credentials("hydrosea_test","secret_test_123456").build()
        .makeBucket(MakeBucketArgs.builder().bucket("hydrosea-test").build());
  }
  @Test void migration_parcours_concurrence_et_minio() {
    UUID correlation=UUID.randomUUID();
    var tiers=service.creer(new CommandeCreerTiers(CategorieTiers.PERSONNE_PHYSIQUE,new PersonnePhysique("Martin",null,"Camille",null),null),correlation);
    assertThat(service.consulter(tiers.identifiant()).reference()).startsWith("TIE-");
    var modifie=service.modifier(tiers.identifiant(),new CommandeModifierTiers(new PersonnePhysique("Martin",null,"Camille Anne",null),null),1,correlation);
    assertThat(modifie.version()).isEqualTo(2);
    org.junit.jupiter.api.Assertions.assertThrows(VersionObsoleteException.class,()->service.archiver(tiers.identifiant(),1,correlation));
    byte[] contenu="controle MinIO".getBytes(java.nio.charset.StandardCharsets.UTF_8);
    stockage.deposer("tests/controle.txt",new ByteArrayInputStream(contenu),contenu.length,"text/plain");
    assertThat(stockage.lire("tests/controle.txt")).isEqualTo(contenu); stockage.supprimer("tests/controle.txt");
  }

  @Test void idempotence_serialise_une_execution_et_rejoue_la_reponse_http_exacte() throws Exception {
    AtomicInteger executions=new AtomicInteger(); CountDownLatch depart=new CountDownLatch(1);
    var executant=Executors.newFixedThreadPool(2);
    java.util.concurrent.Callable<ServiceIdempotence.Resultat<String>> appel=()->{
      depart.await();
      return idempotence.executer("sujet-a","cle-concurrente","CREER_TEST","/v1/tests",Map.of("nom","A"),String.class,()->{
        executions.incrementAndGet();
        try { Thread.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return ResponseEntity.created(URI.create("/v1/tests/1")).eTag("\"1\"")
            .header("X-Correlation-Id","aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa").body("reponse-initiale");
      });
    };
    var premier=executant.submit(appel); var second=executant.submit(appel); depart.countDown();
    var resultats=List.of(premier.get(10,TimeUnit.SECONDS),second.get(10,TimeUnit.SECONDS)); executant.shutdownNow();
    assertThat(executions).hasValue(1);
    assertThat(resultats).allSatisfy(r->{
      assertThat(r.corps()).isEqualTo("reponse-initiale");
      assertThat(r.enTetes()).containsKeys("Location","ETag","X-Correlation-Id");
    });
    assertThat(resultats.stream().filter(ServiceIdempotence.Resultat::rejoue).count()).isEqualTo(1);
  }

  @Test void idempotence_isole_uri_et_sujet_et_ne_relit_pas_la_ressource() {
    AtomicInteger executions=new AtomicInteger();
    java.util.function.Supplier<ResponseEntity<String>> action=()->{
      executions.incrementAndGet();
      return ResponseEntity.ok().eTag("\"1\"").header("X-Correlation-Id",UUID.randomUUID().toString()).body("version-1");
    };
    idempotence.executer("sujet-a","cle-portee","OP","/v1/a",Map.of(),String.class,action);
    var rejeu=idempotence.executer("sujet-a","cle-portee","OP","/v1/a",Map.of(),String.class,
        ()->ResponseEntity.ok("version-2"));
    idempotence.executer("sujet-a","cle-portee","OP","/v1/b",Map.of(),String.class,action);
    idempotence.executer("sujet-b","cle-portee","OP","/v1/a",Map.of(),String.class,action);
    assertThat(rejeu.corps()).isEqualTo("version-1"); assertThat(rejeu.rejoue()).isTrue();
    assertThat(executions).hasValue(3);
  }

  @Test void interdit_de_deplacer_une_specialisation_vers_un_autre_tiers() {
    UUID correlation=UUID.randomUUID();
    var tiers=service.creer(new CommandeCreerTiers(CategorieTiers.PERSONNE_PHYSIQUE,
        new PersonnePhysique("Immuable",null,"Cle",null),null),correlation);
    org.junit.jupiter.api.Assertions.assertThrows(org.springframework.dao.DataAccessException.class,
        ()->jdbc.update("UPDATE ref.tiers_personne_physique SET tiers_id=? WHERE tiers_id=?",UUID.randomUUID(),tiers.identifiant()));
  }

  @Test void homonyme_sans_siret_signale_mais_ne_bloque_pas_et_siret_identique_bloque() {
    UUID correlation=UUID.randomUUID(); String suffixe=UUID.randomUUID().toString().substring(0,8);
    var sansSiret=new CommandeCreerTiers(CategorieTiers.PERSONNE_MORALE,null,
        new PersonneMorale("Atelier "+suffixe,null,"SAS"));
    service.creer(sansSiret,correlation);
    assertThat(service.creer(sansSiret,correlation).identifiant()).isNotNull();
    String siret=String.format("%014d",Math.abs(UUID.randomUUID().getLeastSignificantBits()%1_000_000_000_000L));
    var avecSiret=new CommandeCreerTiers(CategorieTiers.PERSONNE_MORALE,null,
        new PersonneMorale("Entreprise "+suffixe,siret,"SAS"));
    service.creer(avecSiret,correlation);
    org.junit.jupiter.api.Assertions.assertThrows(fr.hydrosea.tiers.application.DoublonProbableException.class,
        ()->service.creer(avecSiret,correlation));
  }

  @Test void archivage_rejoue_avec_l_ancien_if_match() {
    UUID correlation=UUID.randomUUID();
    var tiers=service.creer(new CommandeCreerTiers(CategorieTiers.PERSONNE_PHYSIQUE,
        new PersonnePhysique("Archive",null,UUID.randomUUID().toString(),null),null),correlation);
    var authentification=new UsernamePasswordAuthenticationToken("sujet-archive","secret",
        List.of(new SimpleGrantedAuthority("SCOPE_tiers:ecriture")));
    SecurityContextHolder.getContext().setAuthentication(authentification);
    try {
      var premiere=controleur.archiver(tiers.identifiant(),"\"1\"","cle-archive-test",new ArchiverTiers("test"),authentification);
      var rejeu=controleur.archiver(tiers.identifiant(),"\"1\"","cle-archive-test",new ArchiverTiers("test"),authentification);
      assertThat(rejeu.getBody()).isEqualTo(premiere.getBody());
      assertThat(rejeu.getHeaders()).containsEntry("ETag",premiere.getHeaders().get("ETag"));
    } finally {
      SecurityContextHolder.clearContext();
    }
  }
}
