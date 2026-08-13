package fr.hydrosea.tiers.infrastructure;

import fr.hydrosea.tiers.application.PortTiers;
import fr.hydrosea.tiers.application.ResultatDetectionDoublon;
import fr.hydrosea.commun.application.VersionObsoleteException;
import fr.hydrosea.tiers.domaine.CategorieTiers;
import fr.hydrosea.tiers.domaine.PersonneMorale;
import fr.hydrosea.tiers.domaine.PersonnePhysique;
import fr.hydrosea.tiers.domaine.StatutTiers;
import fr.hydrosea.tiers.domaine.Tiers;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdaptateurJdbcTiers implements PortTiers {
  private static final String PROJECTION = """
      SELECT t.id,t.reference,t.categorie,t.statut,t.version,t.date_creation,t.date_modification,
      p.nom,p.nom_usage,p.prenoms,p.date_naissance,m.raison_sociale,m.siret,m.forme_juridique
      FROM ref.tiers t LEFT JOIN ref.tiers_personne_physique p ON p.tiers_id=t.id
      LEFT JOIN ref.tiers_personne_morale m ON m.tiers_id=t.id
      """;
  private final JdbcTemplate jdbc;

  public AdaptateurJdbcTiers(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  @Override
  public Tiers creer(Tiers tiers) {
    String reference = jdbc.queryForObject("SELECT 'TIE-' || lpad(nextval('ref.sequence_reference_tiers')::text, 8, '0')", String.class);
    jdbc.update("INSERT INTO ref.tiers(id,reference,categorie,statut,version) VALUES (?,?,?,?,1)",
        tiers.identifiant(), reference, tiers.categorie().name(), tiers.statut().name());
    enregistrerSpecialisation(tiers);
    return trouver(tiers.identifiant()).orElseThrow();
  }

  private void enregistrerSpecialisation(Tiers tiers) {
    if (tiers.personnePhysique() != null) {
      var p = tiers.personnePhysique();
      jdbc.update("INSERT INTO ref.tiers_personne_physique(tiers_id,nom,nom_usage,prenoms,date_naissance) VALUES (?,?,?,?,?)",
          tiers.identifiant(), p.nom(), p.nomUsage(), p.prenoms(), p.dateNaissance());
    } else {
      var m = tiers.personneMorale();
      jdbc.update("INSERT INTO ref.tiers_personne_morale(tiers_id,raison_sociale,siret,forme_juridique) VALUES (?,?,?,?)",
          tiers.identifiant(), m.raisonSociale(), m.siret(), m.formeJuridique());
    }
  }

  @Override
  public Optional<Tiers> trouver(UUID identifiant) {
    return jdbc.query(PROJECTION + " WHERE t.id=?", this::mapper, identifiant).stream().findFirst();
  }

  @Override
  public Page<Tiers> rechercher(String recherche, String reference, CategorieTiers categorie, String statut, Pageable page) {
    StringBuilder filtre = new StringBuilder(" WHERE 1=1");
    List<Object> parametres = new ArrayList<>();
    if (recherche != null && !recherche.isBlank()) {
      filtre.append(" AND lower(concat_ws(' ',t.reference,p.nom,p.prenoms,m.raison_sociale,m.siret)) LIKE ?");
      parametres.add("%" + recherche.toLowerCase() + "%");
    }
    if (reference != null && !reference.isBlank()) { filtre.append(" AND t.reference=?"); parametres.add(reference); }
    if (categorie != null) { filtre.append(" AND t.categorie=?"); parametres.add(categorie.name()); }
    if (statut != null && !statut.isBlank()) { filtre.append(" AND t.statut=?"); parametres.add(statut); }
    Long total = jdbc.queryForObject("SELECT count(*) FROM ref.tiers t LEFT JOIN ref.tiers_personne_physique p ON p.tiers_id=t.id LEFT JOIN ref.tiers_personne_morale m ON m.tiers_id=t.id" + filtre,
        Long.class, parametres.toArray());
    var tri = page.getSort().stream().findFirst().orElseThrow();
    String colonne = java.util.Map.of("reference", "t.reference", "date_creation", "t.date_creation",
        "statut", "t.statut").get(tri.getProperty());
    if (colonne == null) throw new IllegalArgumentException("Critère de tri non autorisé.");
    parametres.add(page.getPageSize()); parametres.add(page.getOffset());
    String ordre = colonne + (tri.isAscending() ? " ASC" : " DESC") + ", t.id ASC";
    List<Tiers> resultat = jdbc.query(PROJECTION + filtre + " ORDER BY " + ordre
        + " LIMIT ? OFFSET ?", this::mapper, parametres.toArray());
    return new PageImpl<>(resultat, page, total == null ? 0 : total);
  }

  @Override
  public Tiers mettreAJour(Tiers tiers, int versionAttendue) {
    int lignes = jdbc.update("UPDATE ref.tiers SET statut=?,date_modification=now(),date_suppression=CASE WHEN ?='ARCHIVE' THEN now() ELSE NULL END,version=version+1 WHERE id=? AND version=?",
        tiers.statut().name(), tiers.statut().name(), tiers.identifiant(), versionAttendue);
    if (lignes == 0) throw new VersionObsoleteException();
    if (tiers.personnePhysique() != null) {
      var p = tiers.personnePhysique();
      jdbc.update("UPDATE ref.tiers_personne_physique SET nom=?,nom_usage=?,prenoms=?,date_naissance=? WHERE tiers_id=?",
          p.nom(), p.nomUsage(), p.prenoms(), p.dateNaissance(), tiers.identifiant());
    } else {
      var m = tiers.personneMorale();
      jdbc.update("UPDATE ref.tiers_personne_morale SET raison_sociale=?,siret=?,forme_juridique=? WHERE tiers_id=?",
          m.raisonSociale(), m.siret(), m.formeJuridique(), tiers.identifiant());
    }
    return trouver(tiers.identifiant()).orElseThrow();
  }

  @Override
  public ResultatDetectionDoublon detecterDoublon(Tiers tiers) {
    if (tiers.personnePhysique() != null) {
      List<UUID> candidats = jdbc.query("""
          SELECT p.tiers_id FROM ref.tiers_personne_physique p JOIN ref.tiers t ON t.id=p.tiers_id
          WHERE t.statut='ACTIF' AND lower(regexp_replace(trim(p.nom),'\\s+',' ','g'))=lower(regexp_replace(trim(?),'\\s+',' ','g'))
          AND lower(regexp_replace(trim(p.prenoms),'\\s+',' ','g'))=lower(regexp_replace(trim(?),'\\s+',' ','g'))
          AND p.date_naissance IS NOT DISTINCT FROM ?
          """, (rs, n) -> rs.getObject(1, UUID.class), tiers.personnePhysique().nom(),
          tiers.personnePhysique().prenoms(), tiers.personnePhysique().dateNaissance());
      return candidats.isEmpty() ? ResultatDetectionDoublon.aucun()
          : new ResultatDetectionDoublon(ResultatDetectionDoublon.Niveau.CERTAIN, true,
              "Identité civile normalisée et date de naissance identiques parmi les Tiers actifs.", candidats);
    }
    PersonneMorale morale = tiers.personneMorale();
    if (morale.siret() != null) {
      List<UUID> siret = jdbc.query("""
          SELECT m.tiers_id FROM ref.tiers_personne_morale m WHERE m.siret=?
          """, (rs, n) -> rs.getObject(1, UUID.class), morale.siret());
      if (!siret.isEmpty()) return new ResultatDetectionDoublon(ResultatDetectionDoublon.Niveau.CERTAIN, true,
          "SIRET identique parmi les Tiers actifs ou archivés.", siret);
    }
    List<UUID> homonymes = jdbc.query("""
        SELECT m.tiers_id FROM ref.tiers_personne_morale m JOIN ref.tiers t ON t.id=m.tiers_id
        WHERE t.statut='ACTIF' AND lower(regexp_replace(trim(m.raison_sociale),'\\s+',' ','g'))=
          lower(regexp_replace(trim(?),'\\s+',' ','g'))
        """, (rs, n) -> rs.getObject(1, UUID.class), morale.raisonSociale());
    return homonymes.isEmpty() ? ResultatDetectionDoublon.aucun()
        : new ResultatDetectionDoublon(ResultatDetectionDoublon.Niveau.SIGNAL, false,
            "Raison sociale normalisée homonyme sans identité SIRET certaine.", homonymes);
  }

  private Tiers mapper(ResultSet rs, int ligne) throws SQLException {
    CategorieTiers categorie = CategorieTiers.valueOf(rs.getString("categorie"));
    PersonnePhysique physique = categorie == CategorieTiers.PERSONNE_PHYSIQUE
        ? new PersonnePhysique(rs.getString("nom"), rs.getString("nom_usage"), rs.getString("prenoms"), rs.getObject("date_naissance", java.time.LocalDate.class)) : null;
    PersonneMorale morale = categorie == CategorieTiers.PERSONNE_MORALE
        ? new PersonneMorale(rs.getString("raison_sociale"), rs.getString("siret"), rs.getString("forme_juridique")) : null;
    return new Tiers(rs.getObject("id", UUID.class), rs.getString("reference"), categorie,
        StatutTiers.valueOf(rs.getString("statut")), physique, morale, rs.getInt("version"),
        rs.getTimestamp("date_creation").toInstant(), rs.getTimestamp("date_modification").toInstant());
  }
}
