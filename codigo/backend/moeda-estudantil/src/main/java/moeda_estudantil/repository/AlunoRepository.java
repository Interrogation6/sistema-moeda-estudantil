package moeda_estudantil.repository;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.views.AlunoView;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    @Query("""
         select new moeda_estudantil.views.AlunoView(
           a.id,
           a.nome,
           a.email,
           c.nome,
           i.nome,
           a.saldo
         )
         from Aluno a
         join a.curso c
         join c.instituicao i
         order by a.nome
         """)
  List<AlunoView> findAllView();
}
