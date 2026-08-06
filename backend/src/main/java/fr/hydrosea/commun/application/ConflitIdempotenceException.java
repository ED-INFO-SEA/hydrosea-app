package fr.hydrosea.commun.application;
public class ConflitIdempotenceException extends RuntimeException { public ConflitIdempotenceException() { super("La clé d’idempotence a déjà été utilisée avec une requête différente."); } }

