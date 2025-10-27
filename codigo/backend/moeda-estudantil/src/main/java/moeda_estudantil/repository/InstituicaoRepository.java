package moeda_estudantil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import moeda_estudantil.models.Instituicao;
import moeda_estudantil.views.InstituicaoView;

public interface InstituicaoRepository extends JpaRepository<Instituicao, Long>{
    @Query("""
        select new moeda_estudantil.views.InstituicaoView(
            i.nome
        )
        from Instituicao i
        """)
    List<InstituicaoView> findAllView();
}
