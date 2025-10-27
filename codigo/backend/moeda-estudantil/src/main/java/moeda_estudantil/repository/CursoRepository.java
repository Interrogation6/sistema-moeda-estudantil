package moeda_estudantil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import moeda_estudantil.models.Curso;
import moeda_estudantil.views.CursoView;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    @Query("""
        select new moeda_estudantil.views.CursoView(
            c.nome,
            i.nome
        )
        from Curso c
        join c.instituicao i
        """)
    List<CursoView> findAllView();
}
