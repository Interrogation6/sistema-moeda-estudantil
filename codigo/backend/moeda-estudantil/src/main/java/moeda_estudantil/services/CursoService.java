package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Curso;
import moeda_estudantil.repository.CursoRepository;
import moeda_estudantil.views.CursoView;

@Service
public class CursoService {
    @Autowired
    CursoRepository cursoRepository;

    public List<CursoView> getAll() {
        return cursoRepository.findAllView();
    }
}
