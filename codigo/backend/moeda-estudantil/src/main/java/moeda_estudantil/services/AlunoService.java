package moeda_estudantil.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.repository.AlunoRepository;
import moeda_estudantil.repository.CursoRepository;
import moeda_estudantil.views.AlunoDTO;
import moeda_estudantil.views.AlunoView;

@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private CursoRepository cursoRepository;

    public Aluno create(AlunoDTO dto) {
        Aluno aluno = new Aluno();
        
        aluno.setSenhaHash(dto.senha_hash());
        if (dto.nome() != null && !dto.nome().isBlank())
            aluno.setNome(dto.nome());
        if (dto.email() != null && !dto.email().isBlank())
            aluno.setEmail(dto.email());
        if (dto.saldo() != null)
            aluno.setSaldo(dto.saldo());
        if (dto.cursoId() != null) {
            var curso = cursoRepository.findById(dto.cursoId()).orElseThrow();
            aluno.setCurso(curso);
        }


        return alunoRepository.save(aluno);
    }

    public void remove(Long id) {
        alunoRepository.deleteById(id);
    }

    public List<AlunoView> getAll() {
        return alunoRepository.findAllView();
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
        /* newAluno.setInstituicaoId(aluno.getInstituicaoId()); */
        /* newAluno.setCursoId(aluno.getCursoId()); */
        newAluno.setSaldo(aluno.getSaldo());
        newAluno.setVantagemId(aluno.getVantagemId());

        return alunoRepository.save(newAluno);
    }

    public AlunoView patch(Long id, AlunoDTO dto) {
        Aluno aluno = alunoRepository.findById(id).orElseThrow();
  if (dto.nome() != null && !dto.nome().isBlank())
      aluno.setNome(dto.nome());
  if (dto.email() != null && !dto.email().isBlank())
      aluno.setEmail(dto.email());
  if (dto.saldo() != null)
      aluno.setSaldo(dto.saldo());
  if (dto.cursoId() != null) {
      var curso = cursoRepository.findById(dto.cursoId()).orElseThrow();
      aluno.setCurso(curso);
  }
  var s = alunoRepository.save(aluno);
  return new AlunoView(
    s.getId(), 
    s.getNome(),
    s.getEmail(),
    s.getCurso().getNome(),
    s.getCurso().getInstituicao().getNome(),
    s.getSaldo());
    }
}
