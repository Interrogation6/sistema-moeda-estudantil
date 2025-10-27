package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Instituicao;
import moeda_estudantil.repository.InstituicaoRepository;
import moeda_estudantil.views.InstituicaoView;

@Service
public class InstituicaoService {
    @Autowired
    InstituicaoRepository InstituicaoRepository;

    public List<InstituicaoView> getAll() {
        return InstituicaoRepository.findAllView();
    }
}
