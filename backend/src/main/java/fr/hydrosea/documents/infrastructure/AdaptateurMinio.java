package fr.hydrosea.documents.infrastructure;

import fr.hydrosea.documents.application.PortStockageDocuments;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdaptateurMinio implements PortStockageDocuments {
  private final MinioClient client; private final String bucket;
  public AdaptateurMinio(@Value("${hydrosea.stockage.url}") String url,@Value("${hydrosea.stockage.acces}") String acces,
      @Value("${hydrosea.stockage.secret}") String secret,@Value("${hydrosea.stockage.bucket}") String bucket) {
    this.client=MinioClient.builder().endpoint(url).credentials(acces,secret).build(); this.bucket=bucket;
  }
  public void deposer(String cle,InputStream contenu,long taille,String type) {
    try { client.putObject(PutObjectArgs.builder().bucket(bucket).object(cle).stream(contenu,taille,-1).contentType(type).build()); }
    catch (Exception e) { throw new IllegalStateException("Dépôt documentaire impossible.",e); }
  }
  public byte[] lire(String cle) {
    try (var flux=client.getObject(GetObjectArgs.builder().bucket(bucket).object(cle).build())) { return flux.readAllBytes(); }
    catch (Exception e) { throw new IllegalStateException("Lecture documentaire impossible.",e); }
  }
  public void supprimer(String cle) {
    try { client.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(cle).build()); }
    catch (Exception e) { throw new IllegalStateException("Suppression documentaire impossible.",e); }
  }
  public boolean disponible() {
    try { return client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build()); } catch (Exception e) { return false; }
  }
}

