package moeda_estudantil.controllers;

import org.springframework.web.bind.annotation.RestController;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.services.AlunoService;
import moeda_estudantil.views.AlunoDTO;
import moeda_estudantil.views.AlunoView;
import moeda_estudantil.views.VantagemView;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/aluno")
public class AlunoController {
    
    @Autowired
    private AlunoService alunoService;

    @PostMapping
    public String create(@RequestBody AlunoDTO entity) {
        return ResponseEntity.ok(alunoService.create(entity)).toString();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<AlunoView>> getAll() {
        return ResponseEntity.ok(alunoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> getById(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AlunoView> patch(@PathVariable Long id, @RequestBody AlunoDTO entity) {
        return ResponseEntity.ok(alunoService.patch(id, entity));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alunoService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{alunoId}/vantagens/{vantagemId}")
    public ResponseEntity<Void> reivindicarVantagem(@PathVariable Long alunoId, @PathVariable Long vantagemId) {
        
        return alunoService.reivindicarVantagem(alunoId, vantagemId);
    }

    @GetMapping("/{alunoId}/vantagens")
    public ResponseEntity<List<VantagemView>> getVantagens(@PathVariable Long alunoId) {
        return ResponseEntity.ok(alunoService.getVantagens(alunoId));
    }

    @GetMapping("/{alunoId}/extratos")
    public ResponseEntity<java.util.List<moeda_estudantil.models.Extrato>> getExtratos(@PathVariable Long alunoId) {
        return ResponseEntity.ok(alunoService.getExtratos(alunoId));
    }

    @PostMapping("/{remetenteId}/enviar/{valor}/{destinatarioId}")
    public ResponseEntity<Void> enviar(@PathVariable Long remetenteId, @PathVariable Long valor, @PathVariable Long destinatarioId) {
        return alunoService.enviarMoeda(remetenteId, destinatarioId, valor);
    }
    
}
