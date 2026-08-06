package fr.hydrosea.integration;

import static org.assertj.core.api.Assertions.assertThat;
import fr.hydrosea.documents.application.PortStockageDocuments;
import fr.hydrosea.tiers.application.CommandesTiers;
import fr.hydrosea.tiers.application.ServiceTiers;
import fr.hydrosea.tiers.application.VersionObsoleteException;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import java.io.ByteArrayInputStream;
import java.util.UUID;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
  @BeforeAll void creerBucket() throws Exception {
    MinioClient.builder().endpoint("http://"+MINIO.getHost()+":"+MINIO.getMappedPort(9000)).credentials("hydrosea_test","secret_test_123456").build()
        .makeBucket(MakeBucketArgs.builder().bucket("hydrosea-test").build());
  }
  @Test void migration_parcours_concurrence_et_minio() {
    UUID correlation=UUID.randomUUID();
    var tiers=service.creer(new CommandesTiers.Creer("PERSONNE_PHYSIQUE",new PersonnePhysique("Martin",null,"Camille",null),null),correlation);
    assertThat(service.consulter(tiers.identifiant()).reference()).startsWith("TIE-");
    var modifie=service.modifier(tiers.identifiant(),new CommandesTiers.Modifier(new PersonnePhysique("Martin",null,"Camille Anne",null),null),1,correlation);
    assertThat(modifie.version()).isEqualTo(2);
    org.junit.jupiter.api.Assertions.assertThrows(VersionObsoleteException.class,()->service.archiver(tiers.identifiant(),1,correlation));
    byte[] contenu="controle MinIO".getBytes(java.nio.charset.StandardCharsets.UTF_8);
    stockage.deposer("tests/controle.txt",new ByteArrayInputStream(contenu),contenu.length,"text/plain");
    assertThat(stockage.lire("tests/controle.txt")).isEqualTo(contenu); stockage.supprimer("tests/controle.txt");
  }
}
