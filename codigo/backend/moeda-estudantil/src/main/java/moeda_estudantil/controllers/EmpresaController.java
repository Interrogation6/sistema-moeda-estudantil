package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.RestController;

import moeda_estudantil.models.Empresa;
import moeda_estudantil.services.EmpresaService;
import moeda_estudantil.views.EmpresaDTO;
import moeda_estudantil.views.EmpresaView;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/empresa")
public class EmpresaController {
    
    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public String create(@RequestBody EmpresaDTO entity) {
        return ResponseEntity.ok(empresaService.create(entity)).toString();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<EmpresaView>> getAll() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getById(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmpresaView> patch(@PathVariable Long id, @RequestBody EmpresaDTO entity) {
        return ResponseEntity.ok(empresaService.patch(id, entity));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        empresaService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
