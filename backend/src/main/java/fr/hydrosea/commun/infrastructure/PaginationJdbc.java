package fr.hydrosea.commun.infrastructure;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public final class PaginationJdbc {
  private PaginationJdbc() {}

  public static <T> Page<T> executer(JdbcTemplate jdbc, String requeteComptage,
      String requeteSelection, Pageable page, Map<String, String> trisAutorises,
      RowMapper<T> mapper) {
    Sort.Order tri = page.getSort().stream().findFirst()
        .orElseThrow(() -> new IllegalArgumentException("Un tri explicite est obligatoire."));
    String colonne = trisAutorises.get(tri.getProperty());
    if (colonne == null) throw new IllegalArgumentException("Critère de tri non autorisé.");
    Long total = jdbc.queryForObject(requeteComptage, Long.class);
    String ordre = colonne + (tri.isAscending() ? " ASC" : " DESC") + ", id ASC";
    List<T> resultats = jdbc.query(requeteSelection + " ORDER BY " + ordre + " LIMIT ? OFFSET ?",
        mapper, page.getPageSize(), page.getOffset());
    return new PageImpl<>(resultats, page, total == null ? 0 : total);
  }
}
