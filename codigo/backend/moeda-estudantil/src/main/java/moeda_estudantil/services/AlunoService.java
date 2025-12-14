package moeda_estudantil.services;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import moeda_estudantil.models.Aluno;
import moeda_estudantil.models.Extrato;
import moeda_estudantil.models.Vantagem;
import moeda_estudantil.repository.AlunoRepository;
import moeda_estudantil.repository.CursoRepository;
import moeda_estudantil.repository.VantagemRepository;
import moeda_estudantil.views.AlunoDTO;
import moeda_estudantil.views.AlunoView;
import moeda_estudantil.views.VantagemView;

@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private CursoRepository cursoRepository;
    @Autowired
    private VantagemRepository vantagemRepository;
    @Autowired
    private moeda_estudantil.repository.ExtratoRepository extratoRepository;
    @Autowired
    private PasswordEncoder encoder;

    public Aluno create(AlunoDTO dto) {
        Aluno aluno = new Aluno();
        
        if (dto.senha_hash() != null && !dto.senha_hash().isBlank())
            aluno.setSenhaHash(encoder.encode(dto.senha_hash()));
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
        newAluno.setVantagens(aluno.getVantagens());

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
  if (dto.senha_hash() != null) {
      aluno.setSenhaHash(encoder.encode(dto.senha_hash()));
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

    @Transactional
    public ResponseEntity<Void> reivindicarVantagem(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        boolean success = aluno.getVantagens().add(vantagem);
        aluno.setSaldo(aluno.getSaldo() - vantagem.getValor());
        if(success) {
            alunoRepository.save(aluno);

            // registrar extrato da reivindicação (remetente = aluno, destinatario = null)
            try {
                moeda_estudantil.models.Extrato ex = new moeda_estudantil.models.Extrato();
                ex.setRemetente(aluno);
                ex.setDestinatario(null);
                ex.setValor(-vantagem.getValor());
                ex.setVantagem(vantagem);
                extratoRepository.save(ex);
            } catch (Exception exx) {
                // não impedir a reivindicação caso registro de extrato falhe, apenas logar
                System.err.println("Erro ao salvar extrato de reivindicação: " + exx.getMessage());
            }

            return ResponseEntity.noContent().build();
        }
        else {
            return ResponseEntity.status(409).build();
        }
    }

    @Transactional(readOnly = true)
    public List<VantagemView> getVantagens(Long alunoId) {

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        // Garantimos que o Hibernate ainda está dentro da transação
        return alunoRepository.findVantagensById(alunoId).orElseThrow(() -> new RuntimeException("Erro ao carregar vantagens"));
    }

    @Transactional(readOnly = true)
    public List<moeda_estudantil.models.Extrato> getExtratos(Long alunoId) {
        // retorna extratos onde o aluno é remetente ou destinatário
        return extratoRepository.findByRemetenteIdOrDestinatarioIdOrderByDataHoraDesc(alunoId, alunoId);
    }

    @Transactional
    public ResponseEntity<Void> enviarMoeda(Long remetenteId, Long destinatarioId, Long valorCentavos) {
        Aluno remetente = alunoRepository.findById(remetenteId)
                .orElseThrow(() -> new RuntimeException("Remetente não encontrado"));
        Aluno destinatario = alunoRepository.findById(destinatarioId)
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        double valor = (valorCentavos == null) ? 0.0 : (valorCentavos.doubleValue() / 100.0);

        Double saldoRem = remetente.getSaldo();
        if (saldoRem == null) saldoRem = 0.0;
        if (saldoRem < valor) {
            return ResponseEntity.status(409).build(); // saldo insuficiente
        }

        remetente.setSaldo(saldoRem - valor);
        Double saldoDest = destinatario.getSaldo();
        if (saldoDest == null) saldoDest = 0.0;
        destinatario.setSaldo(saldoDest + valor);

        alunoRepository.save(remetente);
        alunoRepository.save(destinatario);

        Extrato ex = new Extrato();
        ex.setRemetente(remetente);
        ex.setDestinatario(destinatario);
        ex.setValor(valor);
        ex.setVantagem(null);
        extratoRepository.save(ex);

        return ResponseEntity.noContent().build();
    }
}
