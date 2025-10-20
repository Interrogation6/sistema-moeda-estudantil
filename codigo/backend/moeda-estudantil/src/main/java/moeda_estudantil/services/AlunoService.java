package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.repository.AlunoRepository;

@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;

    public Aluno create(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public void remove(Long id) {
        alunoRepository.deleteById(id);
    }

    public List<Aluno> getAll() {
        return alunoRepository.findAll();
    }

    public Aluno getById(Long id) {
        return alunoRepository.findById(id).orElse(null);
    }

    public Aluno update(Long id, Aluno aluno) {
        Aluno newAluno = alunoRepository.findById(id).orElse(null);
        if(newAluno == null) {
            return null;
        }
        
        newAluno.setNome(aluno.getNome());
        newAluno.setEmail(aluno.getEmail());
        newAluno.setLogin(aluno.getLogin());
        newAluno.setSenhaHash(aluno.getSenhaHash());
        newAluno.setCpf(aluno.getCpf());
        newAluno.setRg(aluno.getRg());
        newAluno.setCep(aluno.getCep());
        newAluno.setInstituicaoId(aluno.getInstituicaoId());
        newAluno.setCursoId(aluno.getCursoId());
        newAluno.setSaldo(aluno.getSaldo());
        newAluno.setVantagemId(aluno.getVantagemId());

        return alunoRepository.save(newAluno);
    }
}
