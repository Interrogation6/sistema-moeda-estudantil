package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Vantagem;
import moeda_estudantil.models.Empresa;
import moeda_estudantil.repository.VantagemRepository;
import moeda_estudantil.repository.EmpresaRepository;
import moeda_estudantil.views.VantagemDTO;
import moeda_estudantil.views.VantagemView;

@Service
public class VantagemService {

    @Autowired
    private VantagemRepository vantagemRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    public List<VantagemView> getAtivos() {
        return vantagemRepository.findAtivos();
    }

    public Vantagem create(VantagemDTO dto) {
        Vantagem vantagem = new Vantagem();
        vantagem.setNome(dto.nome());
        vantagem.setDescricao(dto.descricao());
        vantagem.setValor(dto.valor());
        vantagem.setAtivo(true);
        vantagem.setImagemPath(dto.imagem_path());

        if (dto.empresa_id() != null) {
            Empresa empresa = empresaRepository.findById(dto.empresa_id())
                    .orElseThrow(
                            () -> new IllegalArgumentException("ID de empresa nao encontrada: " + dto.empresa_id()));
            vantagem.setEmpresa(empresa);
        }

        return vantagemRepository.save(vantagem);
    }

    public List<VantagemView> getAll(Long id) {
        return vantagemRepository.findByEmpresa(id);
    }

    public String toggleAtivo(Long id) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID de vantagem nao encontrada: " + id));
        vantagem.setAtivo(!vantagem.getAtivo());
        vantagemRepository.save(vantagem);
        return vantagem.getAtivo() ? "ativo" : "inativo";
    }
}
