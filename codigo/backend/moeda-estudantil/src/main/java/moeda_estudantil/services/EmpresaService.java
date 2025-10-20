package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Empresa;
import moeda_estudantil.repository.EmpresaRepository;

@Service
public class EmpresaService {
    
    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa create(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public void remove(Long id) {
        empresaRepository.deleteById(id);
    }

    public List<Empresa> getAll() {
        return empresaRepository.findAll();
    }

    public Empresa getById(Long id) {
        return empresaRepository.findById(id).orElse(null);
    }

    public Empresa update(Long id, Empresa empresa) {
        Empresa newEmpresa = empresaRepository.findById(id).orElse(null);
        if(newEmpresa == null) {
            return null;
        }
        newEmpresa.setNome(empresa.getNome());
        newEmpresa.setLogin(empresa.getLogin());
        newEmpresa.setSenhaHash(empresa.getSenhaHash());
        newEmpresa.setVantagemId(empresa.getVantagemId());

        return empresaRepository.save(newEmpresa);
    }
}
