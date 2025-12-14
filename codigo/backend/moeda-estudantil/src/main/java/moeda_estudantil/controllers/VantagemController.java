package moeda_estudantil.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import moeda_estudantil.services.VantagemService;
import moeda_estudantil.views.VantagemDTO;
import moeda_estudantil.views.VantagemView;

@RestController
@RequestMapping("/vantagem")
public class VantagemController {

    @Autowired
    private VantagemService vantagemService;

    @GetMapping("/getAtivos")
    public ResponseEntity<List<VantagemView>> getAtivos() {
        return ResponseEntity.ok(vantagemService.getAtivos());
    }

    @PostMapping()
    public String create(@RequestBody VantagemDTO entity) {
        return ResponseEntity.ok(vantagemService.create(entity)).toString();
    }

    @GetMapping("/getAll/{id}")
    public ResponseEntity<List<VantagemView>> getAll(@PathVariable Long id) {
        return ResponseEntity.ok(vantagemService.getAll(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> toggleAtivo(@PathVariable Long id) {
        return ResponseEntity.ok(vantagemService.toggleAtivo(id));
    }

}
