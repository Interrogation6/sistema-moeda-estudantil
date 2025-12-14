package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.RestController;

import moeda_estudantil.models.Curso;
import moeda_estudantil.services.CursoService;
import moeda_estudantil.views.CursoView;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/curso")
public class CursoController {
    @Autowired
    CursoService cursoService;
    
     @GetMapping("/getAll")
    public ResponseEntity<List<CursoView>> getAll() {
        return ResponseEntity.ok(cursoService.getAll());
    }
}
