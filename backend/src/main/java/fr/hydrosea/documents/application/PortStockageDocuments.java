package fr.hydrosea.documents.application;

import java.io.InputStream;

public interface PortStockageDocuments {
  void deposer(String cle,InputStream contenu,long taille,String typeContenu);
  byte[] lire(String cle);
  void supprimer(String cle);
  boolean disponible();
}

