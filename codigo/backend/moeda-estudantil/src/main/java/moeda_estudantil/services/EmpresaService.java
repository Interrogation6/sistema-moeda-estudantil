package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Empresa;
import moeda_estudantil.repository.EmpresaRepository;
import moeda_estudantil.views.EmpresaDTO;
import moeda_estudantil.views.EmpresaView;

@Service
public class EmpresaService {
    
    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa create(EmpresaDTO dto) {
        Empresa empresa = new Empresa();

        empresa.setSenhaHash(dto.senha_hash());
         if (dto.nome() != null && !dto.nome().isBlank())
            empresa.setNome(dto.nome());
        if (dto.login() != null && !dto.login().isBlank())
            empresa.setLogin(dto.login());

        return empresaRepository.save(empresa);
    }

    public void remove(Long id) {
        empresaRepository.deleteById(id);
    }

    public List<EmpresaView> getAll() {
        return empresaRepository.findAllView();
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
    
    public EmpresaView patch(Long id, EmpresaDTO dto) {
        Empresa empresa = empresaRepository.findById(id).orElseThrow();
        if(dto.nome() != null && !dto.nome().isBlank())
            empresa.setNome(dto.nome());
        if(dto.login() != null && !dto.login().isBlank())
            empresa.setLogin(dto.login());
        var s = empresaRepository.save(empresa);
        return new EmpresaView(
            s.getId(),
            s.getNome(),
            s.getLogin());
    }
}
