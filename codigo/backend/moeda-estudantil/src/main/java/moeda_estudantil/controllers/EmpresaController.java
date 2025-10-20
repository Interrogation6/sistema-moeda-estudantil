package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.RestController;

import moeda_estudantil.models.Empresa;
import moeda_estudantil.services.EmpresaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/empresa")
public class EmpresaController {
    
    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public String criar(@RequestBody Empresa entity) {
        return ResponseEntity.ok(empresaService.create(entity)).toString();
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> getAll() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getById(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empresa> update(@PathVariable Long id, @RequestBody Empresa entity) {
        return ResponseEntity.ok(empresaService.update(id, entity));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        empresaService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
