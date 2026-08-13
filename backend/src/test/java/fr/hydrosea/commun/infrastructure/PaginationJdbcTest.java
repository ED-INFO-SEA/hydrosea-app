package fr.hydrosea.commun.infrastructure;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

class PaginationJdbcTest {
  @Test
  void retourne_la_deuxieme_page_et_le_total_global() {
    JdbcTemplate jdbc = mock(JdbcTemplate.class);
    RowMapper<String> mapper = (ResultSet resultat, int ligne) -> resultat.getString(1);
    when(jdbc.queryForObject("SELECT count(*) FROM objet", Long.class)).thenReturn(5L);
    when(jdbc.query(anyString(), eq(mapper), eq(2), eq(2L))).thenReturn(List.of("C", "D"));

    var page = PaginationJdbc.executer(jdbc, "SELECT count(*) FROM objet",
        "SELECT id,reference FROM objet", PageRequest.of(1, 2, Sort.by("reference")),
        Map.of("reference", "reference"), mapper);

    assertEquals(List.of("C", "D"), page.getContent());
    assertEquals(5, page.getTotalElements());
    assertEquals(3, page.getTotalPages());
    assertEquals(1, page.getNumber());
  }
}
