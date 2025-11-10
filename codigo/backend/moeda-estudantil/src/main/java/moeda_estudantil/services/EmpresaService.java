package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Empresa;
import moeda_estudantil.repository.EmpresaRepository;
import moeda_estudantil.views.EmpresaDTO;
import moeda_estudantil.views.EmpresaView;


@Service
public class EmpresaService {
    
    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder encoder;

    public Empresa create(EmpresaDTO dto) {
        Empresa empresa = new Empresa();

        empresa.setSenhaHash(encoder.encode(dto.senha_hash()));
         if (dto.nome() != null && !dto.nome().isBlank())
            empresa.setNome(dto.nome());
        if (dto.login() != null && !dto.login().isBlank())
            empresa.setEmail(dto.login());

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
        newEmpresa.setEmail(empresa.getEmail());
        newEmpresa.setSenhaHash(encoder.encode(empresa.getSenhaHash()));
        // newEmpresa.setVantagemId(empresa.getVantagem());

        return empresaRepository.save(newEmpresa);
    }
    
    public EmpresaView patch(Long id, EmpresaDTO dto) {
        Empresa empresa = empresaRepository.findById(id).orElseThrow();
        if(dto.nome() != null && !dto.nome().isBlank())
            empresa.setNome(dto.nome());
        if(dto.login() != null && !dto.login().isBlank())
            empresa.setEmail(dto.login());
        if (dto.senha_hash() != null && !dto.senha_hash().isBlank())
            empresa.setSenhaHash(encoder.encode(dto.senha_hash()));
        var s = empresaRepository.save(empresa);
        return new EmpresaView(
            s.getId(),
            s.getNome(),
                s.getEmail());
    }
}
