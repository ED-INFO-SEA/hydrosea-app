package fr.hydrosea.evenements.infrastructure;

import java.util.Locale;
import java.util.regex.Pattern;

public final class ConventionCleRoutage {
  private static final Pattern TERME = Pattern.compile("[A-Z][A-Z0-9_]*");

  private ConventionCleRoutage() {}

  public static String depuis(String typeAgregat, String typeEvenement) {
    if (!TERME.matcher(typeAgregat).matches() || !TERME.matcher(typeEvenement).matches()) {
      throw new IllegalArgumentException(
          "Le type d’agrégat et le type d’événement doivent utiliser des majuscules et des traits bas.");
    }
    return typeAgregat.toLowerCase(Locale.ROOT) + "."
        + typeEvenement.toLowerCase(Locale.ROOT);
  }
}
