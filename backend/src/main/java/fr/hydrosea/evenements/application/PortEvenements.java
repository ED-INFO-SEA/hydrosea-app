package fr.hydrosea.evenements.application;

import java.util.Map;
import java.util.UUID;

public interface PortEvenements {
  void enregistrer(String type, String typeAgregat, UUID agregat, UUID correlation, Map<String, Object> charge);
}
