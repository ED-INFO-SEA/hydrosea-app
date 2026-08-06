package fr.hydrosea.tiers.application;
public class DoublonProbableException extends RuntimeException {
  private final ResultatDetectionDoublon resultat;
  public DoublonProbableException(ResultatDetectionDoublon resultat) {
    super("Un doublon certain existe déjà : " + resultat.motif());
    this.resultat = resultat;
  }
  public ResultatDetectionDoublon resultat() { return resultat; }
}
