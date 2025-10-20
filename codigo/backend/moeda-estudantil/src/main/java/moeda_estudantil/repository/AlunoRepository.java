package moeda_estudantil.repository;

import moeda_estudantil.models.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    
}
