package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.RestController;

import moeda_estudantil.models.Instituicao;
import moeda_estudantil.services.InstituicaoService;
import moeda_estudantil.views.InstituicaoView;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/instituicao")
public class InstituicaoController {
    @Autowired
    InstituicaoService InstituicaoService;
    
     @GetMapping("/getAll")
    public ResponseEntity<List<InstituicaoView>> getAll() {
        return ResponseEntity.ok(InstituicaoService.getAll());
    }
}
