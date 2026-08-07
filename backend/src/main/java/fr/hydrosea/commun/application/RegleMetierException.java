package fr.hydrosea.commun.application;

public class RegleMetierException extends RuntimeException {
  private final String code;
  public RegleMetierException(String message) { this("REGLE_METIER", message); }
  public RegleMetierException(String code, String message) { super(message); this.code = code; }
  public String code() { return code; }
}
