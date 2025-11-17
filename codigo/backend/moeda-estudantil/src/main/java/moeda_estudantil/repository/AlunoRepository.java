package moeda_estudantil.repository;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.views.AlunoView;
import moeda_estudantil.views.VantagemView;

import java.util.List;
import java.util.Optional;

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

  Optional<Aluno> findByEmailIgnoreCase(String email);

  //Long id, String nome, String empresa, String descricao, Double valor, Boolean ativo, String imagem_path
  @Query("""
       select new moeda_estudantil.views.VantagemView(
         v.id,
         v.nome,
         e.nome,
         v.descricao,
         v.valor,
         true,
         v.imagem_path
       )
       from Aluno a
       join a.vantagens v
       join v.empresa e
       where a.id = :alunoId
       order by v.nome
       """)
  Optional<List<VantagemView>> findVantagensById(Long alunoId);
}
