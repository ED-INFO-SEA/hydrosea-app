package fr.hydrosea.commun.application;

public class VersionObsoleteException extends RuntimeException {
  public VersionObsoleteException() {
    super("La ressource a été modifiée depuis son chargement. Rechargez-la avant de recommencer.");
  }
}
