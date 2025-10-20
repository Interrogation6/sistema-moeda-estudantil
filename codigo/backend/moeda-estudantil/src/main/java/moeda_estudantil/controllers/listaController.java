package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.sql.Connection;
import java.util.*;

import moeda_estudantil.db_lib.MainDB;

@RestController
@CrossOrigin(origins = "*")
public class listaController {
    @GetMapping("/getLista")
    public List<Long> getLista() {
        try {
            Connection conn = MainDB.connect();
            if (conn == null) return Collections.emptyList();

            List<Map<String,Object>> results = MainDB.query(conn, "SELECT id FROM aluno;");
            List<Long> ids = new ArrayList<>();
            for (Map<String,Object> row : results) {
                Object v = row.get("id");
                if (v != null) {
                    if (v instanceof Number) ids.add(((Number)v).longValue());
                    else {
                        try { ids.add(Long.parseLong(v.toString())); } catch (Exception ex) { }
                    }
                }
            }
            return ids;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
